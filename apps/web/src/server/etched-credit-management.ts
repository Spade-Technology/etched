//WARNING:  Keep in mind the context here is `CLERK` users with an "overlay" of Prisma `User` based on matching address.

import { prisma } from "@/server/db";
import { z } from "zod";
import { EVMAddressType } from "@/utils/common";
import { clerk_client } from "@/clerkClient";

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

  //Append local credit-related values
  const enrichedUsers = await enrichUsersWithCredits(users.data);

  //Complete navigation
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


const processUserBatch = async (
  users: any[],
  userIds: string[]
): Promise<any[]> => {
  //NOTE: `email` was a poor field name choice for what is mapped `primaryEmailId` in Clerk
  const creditData = await prisma.user.findMany({
    where: {
      email: {
        in: userIds
      }
    },
    select: {
      email: true,
      address: true,
      etchedCreditsRemaining: true
    }
  });

  const creditMap = new Map(
    creditData.map(user => [user.email, user.etchedCreditsRemaining])
  );

  return users.map(user => ({
    ...user,
    etchedCreditsRemaining: creditMap.get(user.primaryEmailAddressId) ?? 0,
    primaryMatchedEmailAddress: user?.emailAddresses?.find((entry: any) => entry.id == user.primaryEmailAddressId)?.emailAddress
    // primaryMatchedEmailAddress: user?.emailAddresses?.find((entry: any) => entry.id.toLowerCase() == user.primaryEmailAddressId.toLowerCase())
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
    // const userIds = userBatch.map(user => user.id);
    const userIds = userBatch.map(user => user.primaryEmailAddressId);

    const enrichedBatch = await processUserBatch(userBatch, userIds);
    enrichedUsers.push(...enrichedBatch);
  }

  return enrichedUsers;
};


/**
 * Update user credits in Prisma DB
 * NOTE: Strictly for UI.  Do not call in `bulkMintEtch`
 */
export const updateUserCredits = async (
  userId: string,
  creditsUpdate: number
): Promise<{ success: boolean; updatedCredits: number | null; error?: string }> => {
  //NOTE: userId is actually email in the DB, but it was a bad choice.
  try {
    const updateResult = await prisma.user.updateMany({
      where: {
        email: userId
      },
      data: {
        etchedCreditsRemaining: {
          set: creditsUpdate
        }
      }
    });

    return {
      success: updateResult.count > 0,
      updatedCredits: updateResult.count > 0 ? creditsUpdate : null,
      error: updateResult.count === 0 ? `User with ID ${userId} not found` : undefined
    };

  } catch (error) {
    console.error('Error updating user credits:', error);
    return {
      success: false,
      updatedCredits: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};



//Primarily for etching (i.e. not interacting with Admin UI)
export const userCreditsRemaining = async (address: EVMAddressType) => {
  const user = await prisma.user.findUnique({
    where: { address: address },
  });

  return Number(user?.etchedCreditsRemaining || 0)
}

export const userHasSufficientCredits = async (address: EVMAddressType, requiredCredits: number = 1, adminGetsPass: boolean = true) => {

  if (adminGetsPass) {
    const user = await prisma.user.findUnique({
      where: { address: address },
    });
    if (user?.isAdministrator == true) {
      console.log('Roll out the red carpet for the admin!!!') // I was removing console.logs but this made laugh so hard that i changed my mind 
      return true
    }
  }

  //otherwise keep going
  const availableCredits = await userCreditsRemaining(address);
  return availableCredits >= requiredCredits;
}

export const deductCreditsFromUser = async (address: EVMAddressType, creditsToDeduct: number = 1) => {
  try {
    const availableCredits = await userCreditsRemaining(address)

    if (availableCredits > 0) {
      creditsToDeduct = Math.max(0, Math.min(creditsToDeduct, availableCredits))
      const updatedUser = await prisma.user.update({
        where: { address },
        data: { etchedCreditsRemaining: { decrement: creditsToDeduct } }
      });
      return updatedUser.etchedCreditsRemaining;
    }
    return availableCredits
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw new Error('Failed to deduct credits');
  }
}