import { env } from "@/env.mjs";
import { currentChain } from "@/utils/wagmi";
import { Address, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";


export const publicClient = createPublicClient({
  chain: currentChain,
  transport: http(env.NEXT_PUBLIC_INFURA_RPC + env.INFURA_KEY),
});



export const walletClient = createWalletClient({
  chain: currentChain,
  transport: http(env.NEXT_PUBLIC_INFURA_RPC + env.INFURA_KEY),
  account: privateKeyToAccount(env.ETCHED_NODE_PRIVATE_KEY as Address),
});
