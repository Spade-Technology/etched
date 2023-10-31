import { contracts } from "@/contracts";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { publicClient, walletClient } from "@/server/web3";
import EtchABI from "@abis/Etches.json";
import { TRPCError } from "@trpc/server";
import { Address, decodeEventLog, encodeFunctionData, keccak256 } from "viem";
import { z } from "zod";
import TeamABI from "@/contracts/abi/Teams.json";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(
      z.object({
        teamName: z.string(),
        teamMembers: z.array(z.string()),
        owningOrg: z.string(),
        blockchainSignature: z.string(),
        blockchainMessage: z.string(),
      })
    )
    .mutation(
      async ({
        input: { teamName, teamMembers, owningOrg, blockchainMessage, blockchainSignature },
        ctx: {
          session: { address },
        },
      }) => {
        let calldata;
        if (owningOrg === "None")
          calldata = encodeFunctionData({
            abi: TeamABI,
            functionName: "createTeam",
            args: [address, teamName, teamMembers],
          });
        else
          calldata = encodeFunctionData({
            abi: TeamABI,
            functionName: "createTeamForOrganisation",
            args: [owningOrg, teamName, teamMembers],
          });

        const tx = await walletClient.writeContract({
          address: contracts.Team,
          functionName: "delegateCallsToSelf",
          args: [
            [
              blockchainMessage as Address,
              keccak256(blockchainMessage as Address),
              blockchainSignature as Address,
              address as Address,
            ],
            [calldata],
          ],
          abi: EtchABI,
        });

        await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        return { tx };
      }
    ),

  renameTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        teamName: z.string(),
        owningOrg: z.string(),
        blockchainSignature: z.string(),
        blockchainMessage: z.string(),
      })
    )
    .mutation(
      async ({
        input: { teamName, teamId, owningOrg, blockchainMessage, blockchainSignature },
        ctx: {
          session: { address },
        },
      }) => {
        const calldata = encodeFunctionData({
          abi: TeamABI,
          functionName: "renameTeam",
          args: [teamId, teamName],
        });

        const tx = await walletClient.writeContract({
          address: contracts.Team,
          functionName: "delegateCallsToSelf",
          args: [
            [
              blockchainMessage as Address,
              keccak256(blockchainMessage as Address),
              blockchainSignature as Address,
              address as Address,
            ],
            [calldata],
          ],
          abi: EtchABI,
        });

        await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        return { tx };
      }
    ),
});
