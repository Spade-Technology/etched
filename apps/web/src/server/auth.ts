import { prisma } from "@/server/db";
import { IncomingMessage } from "http";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { Address, concat, encodeAbiParameters, parseAbiParameters } from "viem";
import { publicClient } from "./web3";

import { currentNetworkId } from "@/contracts";
import { env } from "@/env.mjs";
import { hashMessageForLit, litNetwork } from "@/lit";
import { clerkClient } from "@clerk/nextjs";
import { createERC6492Signature } from "./patch";
import { regenerateCapacityCredits } from "./user-operations";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    address: string | undefined | null;
    isApproved: string | undefined | null;
    isAdmin: boolean | undefined | null;
    user: {
      name: string | undefined | null;
      description: string | undefined | null;
      picture: string | undefined | null;
      userId: string | undefined | null;

      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

var validateSigOffchainBytecode =
  "0x608060405234801561001057600080fd5b50604051610fa6380380610fa683398101604081905261002f91610130565b600060405161003d906100dd565b604051809103906000f080158015610059573d6000803e3d6000fd5b5090506000816001600160a01b0316638f0684308686866040518463ffffffff1660e01b815260040161008e93929190610207565b6020604051808303816000875af11580156100ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100d19190610250565b9050806000526001601ff35b610d2c8061027a83390190565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561011b578181015183820152602001610103565b8381111561012a576000848401525b50505050565b60008060006060848603121561014557600080fd5b83516001600160a01b038116811461015c57600080fd5b6020850151604086015191945092506001600160401b038082111561018057600080fd5b818601915086601f83011261019457600080fd5b8151818111156101a6576101a66100ea565b604051601f8201601f19908116603f011681019083821181831017156101ce576101ce6100ea565b816040528281528960208487010111156101e757600080fd5b6101f8836020830160208801610100565b80955050505050509250925092565b60018060a01b0384168152826020820152606060408201526000825180606084015261023a816080850160208701610100565b601f01601f191691909101608001949350505050565b60006020828403121561026257600080fd5b8151801515811461027257600080fd5b939250505056fe608060405234801561001057600080fd5b50610d0c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806376be4cea146100465780638f0684301461006d57806398ef1ed814610080575b600080fd5b610059610054366004610881565b610093565b604051901515815260200160405180910390f35b61005961007b366004610906565b610638565b61005961008e366004610906565b6106d0565b600073ffffffffffffffffffffffffffffffffffffffff87163b6060827f649264926492649264926492649264926492649264926492649264926492649288886100de602082610962565b6100ea928b92906109a0565b6100f3916109ca565b14905080156101f9576000606089828a61010e602082610962565b9261011b939291906109a0565b8101906101289190610ac3565b955090925090508415806101395750865b156101f2576000808373ffffffffffffffffffffffffffffffffffffffff16836040516101669190610b69565b6000604051808303816000865af19150503d80600081146101a3576040519150601f19603f3d011682016040523d82523d6000602084013e6101a8565b606091505b5091509150816101ef57806040517f9d0d6e2d0000000000000000000000000000000000000000000000000000000081526004016101e69190610bb1565b60405180910390fd5b50505b5050610233565b87878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509294505050505b808061023f5750600083115b15610412576040517f1626ba7e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8b1690631626ba7e90610298908c908690600401610bcb565b602060405180830381865afa9250505080156102d1575060408051601f3d908101601f191682019092526102ce91810190610be4565b60015b610366573d8080156102ff576040519150601f19603f3d011682016040523d82523d6000602084013e610304565b606091505b50851580156103135750600084115b15610332576103278b8b8b8b8b6001610093565b94505050505061062e565b806040517f6f2a95990000000000000000000000000000000000000000000000000000000081526004016101e69190610bb1565b7fffffffff0000000000000000000000000000000000000000000000000000000081167f1626ba7e00000000000000000000000000000000000000000000000000000000148015816103b6575086155b80156103c25750600085115b156103e2576103d68c8c8c8c8c6001610093565b9550505050505061062e565b841580156103ed5750825b80156103f7575087155b1561040657806000526001601ffd5b945061062e9350505050565b604187146104a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f5369676e617475726556616c696461746f72237265636f7665725369676e657260448201527f3a20696e76616c6964207369676e6174757265206c656e67746800000000000060648201526084016101e6565b60006104b16020828a8c6109a0565b6104ba916109ca565b905060006104cc604060208b8d6109a0565b6104d5916109ca565b905060008a8a60408181106104ec576104ec610c26565b919091013560f81c915050601b811480159061050c57508060ff16601c14155b15610599576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f5369676e617475726556616c696461746f723a20696e76616c6964207369676e60448201527f617475726520762076616c75650000000000000000000000000000000000000060648201526084016101e6565b6040805160008152602081018083528e905260ff831691810191909152606081018490526080810183905273ffffffffffffffffffffffffffffffffffffffff8e169060019060a0016020604051602081039080840390855afa158015610604573d6000803e3d6000fd5b5050506020604051035173ffffffffffffffffffffffffffffffffffffffff161496505050505050505b9695505050505050565b6040517f76be4cea00000000000000000000000000000000000000000000000000000000815260009030906376be4cea906106829088908890889088906001908990600401610c55565b6020604051808303816000875af11580156106a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106c59190610cb9565b90505b949350505050565b6040517f76be4cea00000000000000000000000000000000000000000000000000000000815260009030906376be4cea9061071990889088908890889088908190600401610c55565b6020604051808303816000875af1925050508015610754575060408051601f3d908101601f1916820190925261075191810190610cb9565b60015b6107fe573d808015610782576040519150601f19603f3d011682016040523d82523d6000602084013e610787565b606091505b50805160018114156107fa57816000815181106107a6576107a6610c26565b6020910101517fff00000000000000000000000000000000000000000000000000000000000000167f01000000000000000000000000000000000000000000000000000000000000001492506106c8915050565b8082fd5b90506106c8565b73ffffffffffffffffffffffffffffffffffffffff8116811461082757600080fd5b50565b60008083601f84011261083c57600080fd5b50813567ffffffffffffffff81111561085457600080fd5b60208301915083602082850101111561086c57600080fd5b9250929050565b801515811461082757600080fd5b60008060008060008060a0878903121561089a57600080fd5b86356108a581610805565b955060208701359450604087013567ffffffffffffffff8111156108c857600080fd5b6108d489828a0161082a565b90955093505060608701356108e881610873565b915060808701356108f881610873565b809150509295509295509295565b6000806000806060858703121561091c57600080fd5b843561092781610805565b935060208501359250604085013567ffffffffffffffff81111561094a57600080fd5b6109568782880161082a565b95989497509550505050565b60008282101561099b577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b500390565b600080858511156109b057600080fd5b838611156109bd57600080fd5b5050820193919092039150565b80356020831015610a01577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff602084900360031b1b165b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112610a4757600080fd5b813567ffffffffffffffff80821115610a6257610a62610a07565b604051601f8301601f19908116603f01168101908282118183101715610a8a57610a8a610a07565b81604052838152866020858801011115610aa357600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600060608486031215610ad857600080fd5b8335610ae381610805565b9250602084013567ffffffffffffffff80821115610b0057600080fd5b610b0c87838801610a36565b93506040860135915080821115610b2257600080fd5b50610b2f86828701610a36565b9150509250925092565b60005b83811015610b54578181015183820152602001610b3c565b83811115610b63576000848401525b50505050565b60008251610b7b818460208701610b39565b9190910192915050565b60008151808452610b9d816020860160208601610b39565b601f01601f19169290920160200192915050565b602081526000610bc46020830184610b85565b9392505050565b8281526040602082015260006106c86040830184610b85565b600060208284031215610bf657600080fd5b81517fffffffff0000000000000000000000000000000000000000000000000000000081168114610bc457600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff8716815285602082015260a060408201528360a0820152838560c0830137600060c085830181019190915292151560608201529015156080820152601f909201601f1916909101019392505050565b600060208284031215610ccb57600080fd5b8151610bc48161087356fea26469706673582212206a2fd4148763ec93d0defa29cd58f18c4c56947c3efeafa635cd941bdc1a7cae64736f6c634300080c0033";

export async function verifySiweMessage(
  credentials: Record<"message" | "signature" | "derivedVia" | "userId", string> | undefined,
  req: IncomingMessage
) {
  const siwe = new SiweMessage(credentials!.message);

  // Make sure the domain matches
  let nextAuthHost = "";
  const nextAuthUrl = process.env.NEXTAUTH_URL || null;

  if (process.env.NODE_ENV === "development") nextAuthHost = req.headers.host || "";
  else if (!nextAuthUrl) return null;
  else nextAuthHost = new URL(nextAuthUrl).host;

  let verified = { success: false };
  if (credentials?.signature.endsWith("6492".repeat(16)) || credentials?.derivedVia === "EIP1271") {
    let credentials6492 = {
      hash: hashMessageForLit(credentials!.message),
      signature: credentials?.signature as Address,
    };

    if (credentials?.derivedVia === "EIP1271") {
      credentials6492 = await createERC6492Signature({
        userId: credentials?.userId,
        baseProvider: env.NEXT_PUBLIC_PATCHWALLET_KERNEL_NAME,
        _signature: {
          hash: hashMessageForLit(credentials?.message),
          signature: credentials?.signature,
        },
      });
    }

    let isValidSignature = false;
    try {
      const callResponse = await publicClient.call({
        data: concat([
          validateSigOffchainBytecode as Address,
          encodeAbiParameters(parseAbiParameters("address addr, bytes32 dataHash, bytes sig"), [
            siwe.address as Address,
            credentials6492.hash,
            credentials6492.signature,
          ]),
        ]),
      });

      isValidSignature = callResponse.data === "0x01";

      // Check for chainId to be 1
      let invalidChainId = false;
      if (siwe.chainId !== currentNetworkId) invalidChainId = true;

      // Check for expiration (ISO 8601)
      const expirationDate = new Date(siwe.expirationTime || "");
      let expiredMessage = false;
      if (isNaN(expirationDate.getTime()) || expirationDate < new Date()) expiredMessage = true;

      // Check for signing date to be < now
      const signingDate = new Date(siwe.issuedAt || "");
      let invalidSigningDate = false;
      if (isNaN(signingDate.getTime()) || signingDate > new Date()) invalidSigningDate = true;

      verified = { success: isValidSignature && !expiredMessage && !invalidSigningDate && !invalidChainId };
    } catch (e) {
      console.log(e);
    }
  } else
    verified = await siwe
      .verify({
        signature: credentials?.signature || "",
        domain: nextAuthHost,
        // nonce: await getCsrfToken({ req }),
      })
      .catch((e) => {
        console.log(e);
        return { success: false };
      });

  if (verified.success) return siwe;

  return null;
}

// this is quite dirty, unfortunately Lit doesn't support sessions with account abstraction and their IEP1271 implementation is not yet ready.
async function temporaryMintNFTAllocation(address: string) {
  // 7 days expiration
  const expiration_time = 60 * 60 * 24 * 7;
  const requests_per_kiloseconds = 1000;

  if (litNetwork === "datil-dev") return;

  await regenerateCapacityCredits(address);
}

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials) return null;

          // Verify the message
          const siwe = await verifySiweMessage(
            {
              message: credentials.message,
              signature: credentials.signature,
              derivedVia: credentials.derivedVia,
              userId: credentials.userId.toLowerCase(),
            },
            req
          );

          // If the message is invalid, bad request
          if (!siwe) return null;

          // Fetch user by address
          let user = await prisma.user.findUnique({ where: { address: siwe.address } });

          let clerkUser;
          if (credentials.userId && credentials.userId !== "null") {
            clerkUser = await clerkClient.users.getUser(credentials.userId);

            if (!clerkUser?.externalId)
              clerkUser = await clerkClient.users.updateUser(credentials.userId, {
                externalId: siwe.address.toLocaleLowerCase(),
              });
          }

          // If user doesn't exist, create it
          if (!user)
            user = await prisma.user.create({ data: { address: siwe.address, email: clerkUser?.primaryEmailAddressId } });

          const capacityCredit = await prisma.capacityCredit.findFirst({
            where: {
              receiver: { address: siwe.address },
              expiration: { gt: new Date(Date.now() + 60 * 60 * 24 * 1000) },
            },
          });

          if (!capacityCredit) await temporaryMintNFTAllocation(siwe.address);

          // Return the user info
          return { id: siwe.address, isApproved: user.isApproved, isAdmin: user.isAdministrator };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
      credentials: {
        message: {
          label: "Message",
          placeholder: "0x0",
          type: "text",
        },
        signature: {
          label: "Signature",
          placeholder: "0x0",
          type: "text",
        },
        derivedVia: {
          label: "DerivedVia",
          placeholder: "0x0",
          type: "text",
        },
        userId: {
          label: "userId",
          placeholder: "0x0",
          type: "text",
        },
        blockchainMessage: {
          label: "BlockchainMessage",
          placeholder: "0x0",
          type: "text",
        },
        blockchainSignature: {
          label: "BlockchainSignature",
          placeholder: "0x0",
          type: "text",
        },
      },
      name: "Ethereum",
    }),
  ];

  return {
    callbacks: {
      async session({ session, token }) {
        let user = await prisma.user.findUnique({
          where: { address: token.sub },
        });

        session.address = token.sub;
        session.isApproved = user?.isApproved || "Pending";
        session.isAdmin = user?.isAdministrator || false;
        return session;
      },
    },
    pages: {
      signIn: "/auth",
      signOut: "/auth",
      error: "/auth",
      verifyRequest: "/auth",
      newUser: "/auth",
    },
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    secret: process.env.NEXTAUTH_JWT_SECRET,
    session: {
      strategy: "jwt",
    },
  };
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, getAuthOptions(ctx.req));
};
