import { providers } from "ethers";
import { Chain, WalletClient, configureChains, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const currentChain = polygon;
export const { chains, publicClient, webSocketPublicClient } = configureChains([currentChain], [publicProvider()]);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export function walletClientToProviderAndSigner(walletClient: WalletClient, chain: Chain) {
  const { account, transport } = walletClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return { provider, signer };
}
