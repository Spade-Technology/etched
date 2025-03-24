//WARNING:  Keep in mind the context here is `CLERK` users with an "overlay" of Prisma `User` based on matching address.

import { prisma } from "@/server/db";
import { z } from "zod";
import { EVMAddressType } from "@/utils/common";
import { clerk_client } from "@/clerkClient";
import { CreditStatus } from "@prisma/client";

export const UsersListInputSchema = z.object({
  limit: z.number().min(1).max(500).default(50),
  offset: z.number().min(0).optional(),
  orderBy: z.enum([
    'created_at',
    'updated_at',
    '+created_at',
    '+updated_at',
    '-created_at',
    '-updated_at'
  ]).optional()
});
export type UsersListInputSchemaParams = z.infer<typeof UsersListInputSchema>;

const PaginatedResponseSchema = z.object({
  users: z.array(z.any()),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
    navigation: z.object({
      previous: z.number().nullable(),
      next: z.number().nullable(),
    })
  }),
});
export type PaginatedResponseSchemaResult = z.infer<typeof PaginatedResponseSchema>;

const BatchSizeSchema = z.number().min(1).max(500).default(100);
type BatchSize = z.infer<typeof BatchSizeSchema>;

/**
 * Get Clerk users with their available credit count
 */
export const getClerkUserListWithCredits = async (params: UsersListInputSchemaParams): Promise<PaginatedResponseSchemaResult> => {
  const { limit = 10, offset = 0, orderBy } = params;

  // Build query parameters
  const queryParams: Record<string, any> = {
    limit,
    offset,
  };

  if (orderBy) queryParams.orderBy = orderBy;

  // Get users with count
  const [users, total] = await Promise.all([
    clerk_client.users.getUserList(queryParams),
    clerk_client.users.getCount(queryParams),
  ]);

  // Append local credit-related values
  const enrichedUsers = await enrichUsersWithCredits(users.data);

  // Complete navigation
  const hasMore = offset + limit < total;
  const previous = offset > 0 ? Math.max(0, offset - limit) : null;
  const next = hasMore ? offset + limit : null;

  return {
    users: enrichedUsers,
    pagination: {
      total,
      limit,
      offset,
      hasMore,
      navigation: {
        previous,
        next
      }
    }
  };
}

/**
 * Process a batch of users to add credit information
 */
const processUserBatch = async (
  users: any[],
  userIds: string[]
): Promise<any[]> => {
  // Get user data from Prisma
  const userData = await prisma.user.findMany({
    where: {
      email: {
        in: userIds
      }
    },
    select: {
      email: true,
      address: true,
      _count: {
        select: {
          credits: {
            where: {
              status: CreditStatus.AVAILABLE
            }
          }
        }
      }
    }
  });

  // Create a map of email to available credits count
  const creditMap = new Map(
    userData.map(user => [user.email, user._count.credits])
  );

  // Enrich users with credit information
  return users.map(user => ({
    ...user,
    etchedCreditsRemaining: creditMap.get(user.primaryEmailAddressId) ?? 0,
    primaryMatchedEmailAddress: user?.emailAddresses?.find((entry: any) => entry.id == user.primaryEmailAddressId)?.emailAddress
  }));
};

/**
 * Enrich users with credit data from Prisma database
 */
export const enrichUsersWithCredits = async (
  clerkUsers: any[],
  batchSize?: BatchSize
): Promise<any[]> => {
  const validatedBatchSize = BatchSizeSchema.parse(batchSize);
  const enrichedUsers: any[] = [];

  for (let i = 0; i < clerkUsers.length; i += validatedBatchSize) {
    const userBatch = clerkUsers.slice(i, i + validatedBatchSize);
    const userIds = userBatch.map(user => user.primaryEmailAddressId);

    const enrichedBatch = await processUserBatch(userBatch, userIds);
    enrichedUsers.push(...enrichedBatch);
  }

  return enrichedUsers;
};

/**
 * Add credits to a user
 */
export const addCreditsToUser = async (
  userId: string,
  creditsToAdd: number
): Promise<{ success: boolean; totalCredits: number; error?: string }> => {
  try {
    // Find the user by email using findFirst instead of findUnique
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId
      }
    });

    if (!user) {
      return {
        success: false,
        totalCredits: 0,
        error: `User with clerkId ${userId} not found`
      };
    }

    // Create the specified number of credits
    const creditPromises = Array(creditsToAdd).fill(null).map(() =>
      prisma.credit.create({
        data: {
          status: CreditStatus.AVAILABLE,
          userAddress: user.address
        }
      })
    );

    await Promise.all(creditPromises);

    // Count available credits
    const availableCredits = await prisma.credit.count({
      where: {
        userAddress: user.address,
        status: CreditStatus.AVAILABLE
      }
    });

    return {
      success: true,
      totalCredits: availableCredits
    };
  } catch (error) {
    console.error('Error adding credits to user:', error);
    return {
      success: false,
      totalCredits: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get the number of available credits for a user
 */
export const userCreditsRemaining = async (address: EVMAddressType): Promise<number> => {
  const availableCredits = await prisma.credit.count({
    where: {
      userAddress: address,
      status: CreditStatus.AVAILABLE
    }
  });

  return availableCredits;
};

/**
 * Check if a user has sufficient credits
 */
export const userHasSufficientCredits = async (
  address: EVMAddressType,
  requiredCredits: number = 1,
  adminGetsPass: boolean = true
): Promise<boolean> => {
  // Check if user is an admin
  if (adminGetsPass) {
    const user = await prisma.user.findUnique({
      where: { address: address },
    });

    if (user?.isAdministrator === true) {
      console.log('Admin privileges applied - bypassing credit check');
      return true;
    }
  }

  // Check available credits
  const availableCredits = await userCreditsRemaining(address);
  return availableCredits >= requiredCredits;
};


/**
 * Use multiple credits for bulk etch operations
 */
export const useBulkCreditsForEtch = async (
  address: EVMAddressType,
  txHash: string,
  etchIds: string[]
): Promise<number> => {
  try {
    // Find available credits matching the number of etchIds
    const availableCredits = await prisma.credit.findMany({
      where: {
        userAddress: address,
        status: CreditStatus.AVAILABLE
      },
      take: etchIds.length
    });

    if (availableCredits.length < etchIds.length) {
      throw new Error('Insufficient credits available for bulk operation');
    }

    // Update all credits in parallel
    await Promise.all(
      availableCredits.map((credit, index) => {
        return prisma.credit.update({
          where: { id: credit.id },
          data: {
            status: CreditStatus.USED,
            txHash,
            etchId: etchIds[index],
            updatedAt: new Date()
          }
        });
      })
    );

    // Return remaining credits
    return await userCreditsRemaining(address);
  } catch (error) {
    console.error('Error using bulk credits:', error);
    throw new Error('Failed to use bulk credits');
  }
};

export const useCreditsForEtch = async (
  address: EVMAddressType,
  txHash: string,
  etchId: string
): Promise<number> => {
  try {
    // Find one available credit
    const availableCredit = await prisma.credit.findFirst({
      where: {
        userAddress: address,
        status: CreditStatus.AVAILABLE
      }
    });

    if (!availableCredit) {
      return 0;
    }

    // Mark the credit as used
    await prisma.credit.update({
      where: { id: availableCredit.id },
      data: {
        status: CreditStatus.USED,
        txHash,
        etchId,
        updatedAt: new Date()
      }
    });

    // Return remaining credits
    return await userCreditsRemaining(address);
  } catch (error) {
    console.error('Error using credits:', error);
    throw new Error('Failed to use credits');
  }
};

/**
 * Get credit usage history for a user
 */
export const getUserCreditHistory = async (address: EVMAddressType) => {
  return prisma.credit.findMany({
    where: {
      userAddress: address
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
};