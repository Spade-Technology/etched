import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import {
  getClerkUserListWithCredits,
  userCreditsRemaining,
  UsersListInputSchema,
  type PaginatedResponseSchemaResult,
  addCreditsToUser,
  getUserCreditHistory
} from "@/server/etched-credit-management";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { EVMAddressType } from "@/utils/common";
import { clerk_client } from "@/clerkClient";

const passwordValidation = z
  .string()
  .refine(
    (password) =>
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password),
    {
      message:
        "Invalid password. It must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }
  );

async function retrieveStoredCode(code: string) {
  const userCode = await prisma.userActivationCode.findFirstOrThrow({
    where: { code, userAddress: null },
  });

  return {
    storedCode: userCode?.code,
    expiration: userCode?.expiration,
  };
}

async function invalidateStoredCode(code: string, userAddress: string) {
  await prisma.userActivationCode.updateMany({
    where: { code },
    data: { userAddress },
  });
}

async function createStoredCode() {
  const generateRandomPart = () =>
    String.fromCharCode(
      ...Array(5)
        .fill(null)
        .map(() => Math.floor(Math.random() * 26) + 65)
    );
  const code = `${generateRandomPart()}-${generateRandomPart()}-${generateRandomPart()}`;
  const expiration = new Date();

  // 30d
  expiration.setDate(expiration.getDate() + 30);

  await prisma.userActivationCode.create({
    data: { code, expiration },
  });

  return { code, expiration };
}


export const userRouter = createTRPCRouter({
  subscribeToNewsletter: publicProcedure
    .input(z.object({ email: z.string().email(), company: z.string() }))
    .mutation(async ({ input: { email, company } }) => {
      const el = await prisma.subscriber.upsert({
        where: { email },
        update: { company },
        create: { email, company },
      });

      return true;
    }),

  addCreditsToUser: adminProcedure
    .input(z.object({ clerkId: z.string(), credits_to_add: z.number().min(1).max(1000) }))
    .mutation(async ({ input: { clerkId, credits_to_add } }) => {
      try {
        const res = await addCreditsToUser(clerkId, credits_to_add);
        if (!res?.success) {
          throw new TRPCError({ code: "NOT_FOUND", message: res?.error || "Invalid attempt!" });
        }
        return res;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to add credits"
        });
      }
    }),

  getClerkUser: publicProcedure
    .input(z.object({ externalId: z.string().array() }))
    .mutation(async ({ input: { externalId } }) => {
      const user = await clerk_client.users.getUserList({ externalId });

      return user;
    }),


  getUserCreditsRemaining: protectedProcedure
    .query(async ({ ctx: {
      session: { address },
    } }) => {
      const availableCredits = await userCreditsRemaining(address as EVMAddressType);
      return availableCredits;
    }),

  getAllClerkUsersWithCredits: protectedProcedure
    .input(UsersListInputSchema)
    .query(async ({ input }) => {
      //returns paginated list of Clerk users with remaining Etched credits
      return await getClerkUserListWithCredits(input)
    }),

  setClerkProfileImage: protectedProcedure
    .input(
      z.object({
        file: z.string(),
      })
    )
    .mutation(async ({ input: { file }, ctx: { session } }) => {
      if (!session?.clerkUser) {
        console.error(`User Not Found!`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const fileBlob = await fetch(file).then((r) => r.blob());
      const user = await clerk_client.users.updateUserProfileImage(session?.clerkUser.id, { file: fileBlob });

      return user;
    }),
  setClerkPassword: protectedProcedure
    .input(
      z.object({
        password: passwordValidation,
      })
    )
    .mutation(async ({ input: { password }, ctx: { session } }) => {
      if (!session?.clerkUser) {
        console.error(`User Not Found!`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      if (!session?.clerkUser.passwordEnabled) {
        console.error(`Password Isn't Enabled`);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const user = await clerk_client.users.updateUser(session?.clerkUser.id, { password });

      return user;
    }),

  setClerkFirstName: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
      })
    )
    .mutation(async ({ input: { firstName }, ctx: { session } }) => {
      if (!session?.clerkUser) {
        console.error(`User Not Found!`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const user = await clerk_client.users.updateUser(session?.clerkUser.id, { firstName });

      return user;
    }),

  setClerkLastName: protectedProcedure
    .input(
      z.object({
        lastName: z.string(),
      })
    )
    .mutation(async ({ input: { lastName }, ctx: { session } }) => {
      if (!session?.clerkUser) {
        console.error(`User Not Found!`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const user = await clerk_client.users.updateUser(session?.clerkUser.id, { lastName });

      return user;
    }),

  sendActivationCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input: { code }, ctx: { session } }) => {
      // Assuming you have a method to retrieve the stored code and its expiration
      try {
        const { storedCode, expiration } = await retrieveStoredCode(code);
        const currentTime = new Date();

        if (!storedCode) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No activation code found." });
        }

        if (currentTime > expiration) {
          throw new TRPCError({ code: "FORBIDDEN", message: "The activation code has expired." });
        }
      } catch (error) {
        throw new TRPCError({ code: "FORBIDDEN", message: "The activation code is invalid." });
      }

      // Invalidate or delete the code after successful verification
      await invalidateStoredCode(code, session.address!);

      await prisma.user.update({
        where: { address: session.address! },
        data: { isApproved: "Approved" },
      });

      return { success: true, message: "Activation code verified successfully." };
    }),

  createActivationCode: adminProcedure.mutation(async ({ ctx: { session } }) => {
    const { code, expiration } = await createStoredCode();

    return { code, expiration };
  }),

  getUserCreditHistory: protectedProcedure
    .query(async ({ ctx: {
      session: { address },
    } }) => {
      return await getUserCreditHistory(address as EVMAddressType);
    }),
});
