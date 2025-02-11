import { env } from "@/env.mjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

import { getAccessToken, getBaseAccountAddress, signMessageUsingPatchWallet } from "@/server/patch";

export const patchRouter = createTRPCRouter({
  signMessageForPatchWallet: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        baseProvider: z.string().optional().default(env.NEXT_PUBLIC_PATCHWALLET_KERNEL_NAME),
        message: z.string(),
        erc6492: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input: { userId, baseProvider, message, erc6492 } }) => {
      try {
        const access_token = await getAccessToken();
        console.log("MAMA access_token", access_token);


        const signature = await signMessageUsingPatchWallet({
          access_token,
          baseProvider: baseProvider,
          userId,
          erc6492,
          message,
        });

        console.log("MAMA signature", signature);


        return {
          message,
          hash: signature.hash,
          signature: signature.signature,
          user: {
            id: userId,
            provider: baseProvider,
          },
        };
      } catch (error) {
        console.log(error)
        throw error
      }
    }),

  getUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        baseProvider: z.string().optional().default(env.NEXT_PUBLIC_PATCHWALLET_KERNEL_NAME),
      })
    )
    .mutation(async ({ input: { userId, baseProvider } }) => {
      const access_token = await getAccessToken();

      const baseAccountAddress = await getBaseAccountAddress({
        access_token,
        baseProvider: baseProvider,
        userId,
      });

      return {
        eoa: baseAccountAddress,
        id: userId,
        provider: baseProvider,
      };
    }),
});
