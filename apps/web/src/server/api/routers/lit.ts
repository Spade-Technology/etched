import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

import { lit } from "@/LitServerSide";
import { TRPCError } from "@trpc/server";

export const litRouter = createTRPCRouter({
  signMessage: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        token: z.string(),
        message: z.string(),
        pkp: z.object({
          publicKey: z.string(),
          tokenId: z.string(),
          ethAddress: z.string(),
        })
      })
    )
    .mutation(async ({ input: { userId, token, message, pkp } }) => {
      try {
        await lit.connect()

        const sessionsSigs = await lit.getPkpSessionSigs(userId, token, pkp)
        if (!sessionsSigs) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To GET sessionsSigs!!" })

        const resSig = await lit.pkpSignMessage(sessionsSigs, pkp.publicKey, message)
        if (!resSig) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To Sign a message!!" })


        return {
          message,
          signature: resSig,
          user: {
            id: userId,
          },
        };
      } catch (error) {
        console.log(error)
        throw error
      }
    }),

  signRawMessage: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        token: z.string(),
        message: z.string(),
        pkp: z.object({
          publicKey: z.string(),
          tokenId: z.string(),
          ethAddress: z.string(),
        })
      })
    )
    .mutation(async ({ input: { userId, token, message, pkp } }) => {
      try {
        await lit.connect()

        const sessionsSigs = await lit.getPkpSessionSigs(userId, token, pkp)
        if (!sessionsSigs) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To GET sessionsSigs!!" })

        const resSig = await lit.pkpSignRawMessage(sessionsSigs, pkp.publicKey, message)
        if (!resSig) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To Sign a message!!" })


        return {
          message,
          signature: resSig,
          user: {
            id: userId,
          },
        };
      } catch (error) {
        console.log(error)
        throw error
      }
    }),

  getSessionSigs: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        token: z.string(),
        pkp: z.object({
          publicKey: z.string(),
          tokenId: z.string(),
          ethAddress: z.string(),
        })
      })
    )
    .mutation(async ({ input: { userId, token, pkp } }) => {
      try {
        await lit.connect()

        const sessionsSigs = await lit.getPkpSessionSigs(userId, token, pkp)
        if (!sessionsSigs) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To GET sessionsSigs!!" })



        return sessionsSigs
      } catch (error) {
        console.log(error)
        throw error
      }
    }),

  getPkp: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input: { userId }, ctx: { prisma } }) => {
      const myPkp = await prisma.pkp.findUnique({
        where: {
          clerkId: userId
        }
      })
      if (!myPkp) {
        return
      }

      return {
        eoa: myPkp.ethAddress,
        id: userId,
        pkp: myPkp
      }


    }),
  createPkp: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input: { userId }, ctx: { prisma } }) => {
      await lit.connect()
      const pkp = await lit.mintPkp(userId)
      if (!pkp) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To Mint PKP!!" })
      await lit.addUsersAsPayees([pkp.ethAddress])
      await prisma.pkp.create({ data: { ...pkp, clerkId: userId } })

      return {
        eoa: pkp.ethAddress,
        id: userId,
        pkp
      };
    }),

  decryptFromIpfs: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        token: z.string(),
        ipfsCid: z.string()
      })
    )
    .mutation(async ({ input: { userId, token, ipfsCid }, ctx: { prisma } }) => {
      try {
        await lit.connect()

        const pkp = await prisma.pkp.findUnique({
          where: {
            clerkId: userId
          }
        })
        if (!pkp) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To GET pkp!!" })

        const sessionSigs = await lit.getPkpSessionSigs(userId, token, pkp)
        if (!sessionSigs) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable To GET sessionsSigs!!" })

        const data = await lit.decryptFromIpfs({ sessionSigs, ipfsCid })


        return data
      } catch (error) {
        console.log(error)
        throw error
      }
    }),
});
