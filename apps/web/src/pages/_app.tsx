import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ThemeProvider } from "@/utils/theme";
import { RefetchProvider, withUrql } from "@/utils/urql";
import { config } from "@/utils/wagmi";
import { ClerkProvider } from "@clerk/nextjs";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { WagmiConfig } from "wagmi";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <WagmiConfig config={config}>
        <RefetchProvider>
          <SessionProvider session={session}>
            <ThemeProvider>
              <ClerkProvider
                {...pageProps}
                appearance={{
                  variables: {
                    colorPrimary: "#077844",
                  },
                }}
              >
                <Component {...pageProps} />
                <Toaster />
              </ClerkProvider>
            </ThemeProvider>
          </SessionProvider>
        </RefetchProvider>
      </WagmiConfig>
    </>
  );
};

export default withUrql(api.withTRPC(MyApp));
