import { prisma } from "@/server/db";
import { IncomingMessage } from "http";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { clerk_client } from "@/clerkClient";
import { addCreditsToUser } from "./etched-credit-management";

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

      clerkId: string | undefined | null;
      address: string | undefined | null;
      email: string | undefined | null;
      isApproved: string | undefined | null;
      isAdministrator: string | undefined | null;
      etchedCreditsRemaining: string | undefined | null;
      pkpId: string | undefined | null;

      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}


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


  const verified = await siwe
    .verify({
      signature: credentials?.signature || "",
      domain: nextAuthHost,
      // nonce: await getCsrfToken({ req }),
    })



  if (verified.success) return siwe;

  return null;
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

            clerkUser = await clerk_client.users.getUser(credentials.userId);

            if (!clerkUser?.externalId)
              clerkUser = await clerk_client.users.updateUser(credentials.userId, {
                externalId: siwe.address.toLocaleLowerCase(),
              });
          }

          // If user doesn't exist, create it
          if (!user) {
            user = await prisma.user.create({ data: { address: siwe.address, email: clerkUser?.primaryEmailAddressId, clerkId: credentials.userId, pkpId: credentials.pkpAddress } });
            await addCreditsToUser(user.clerkId, 25)
          }

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
        pkpAddress: {
          label: "pkpAddress",
          placeholder: "0x0",
          type: "text",
        }
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

        // @ts-ignore
        session.user = user;

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
