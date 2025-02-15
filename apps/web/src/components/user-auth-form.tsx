"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { shortenAddress } from "@/utils/hooks/address";
import { useSignIn, useSignOut } from "@/utils/hooks/useSignIn";
import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ConnectWalletModalButtonWrapper } from "./connect-wallet";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { Label } from "./ui/label";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isSignup?: boolean;
  factorTwo?: boolean;
  SignInOrUpComponent: () => React.JSX.Element
}

export default function AuthenticationPage({ isSignup }: { isSignup: boolean }) {
  const router = useRouter();
  const { signOut } = useSignOut();

  const { status, data: session } = useSession();
  const { sessionId, isLoaded } = useAuth();

  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    if (status === "authenticated" && session) router.push("/dashboard");
  }, [status, session]);

  React.useEffect(() => {
    if (window?.matchMedia("(prefers-reduced-motion: reduce)").matches) setShowLogin(true);
    else {
      const timer = setTimeout(() => setShowLogin(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const factorTwo = (router.asPath.includes("sso-callback") || router.asPath.includes("factor-two")) && isLoaded;

  return (
    <main className="lg:flex">
      <aside className="hidden h-screen w-7/12 items-center bg-[url('/images/login/Bg.svg')] bg-cover bg-center bg-no-repeat font-body text-white lg:flex">
        <div className="mx-auto w-96">
          <Icons.brightLogo className="h-9 cursor-pointer" onClick={() => router.push("/")} />
          <div className="tracking-lighter my-5 text-base font-medium">The leading blockchain intellectual property platform</div>
          <div className="flex h-10 w-32 cursor-pointer items-center justify-center border-2 border-white text-base font-semibold shadow">
            Learn more
          </div>
        </div>
      </aside>
      <div
        className={`mx-auto flex w-4/6 flex-col items-center justify-center gap-4 py-10 transition-opacity delay-500 duration-1000 ease-in-out ${showLogin ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
      >
        <div className="w-full sm:w-[25rem]">
          {!(sessionId || !factorTwo) && (
            <>
              <div
                className={`font-poppins text-2xl font-bold tracking-tight ${status === "authenticated" ? "text-center" : ""}`}
              >
                {status === "authenticated" ? "You're all set" : isSignup ? "Create your account" : "Hello Again!"}
              </div>

              <p className={`text-sm text-muted-foreground ${status === "authenticated" ? "text-center" : ""}`}>
                {isSignup ? "Create your account" : "Welcome to Etched!"}
              </p>
            </>
          )}

          {status === "authenticated" && session ? (
            <div className="flex w-full flex-col items-center justify-center">
              <Label> Logged in {session?.address && "as " + shortenAddress({ address: session?.address as string })}</Label>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard")}>
                Continue to Dashboard
              </Button>
              <Button variant="destructive" className="mt-4" onClick={() => signOut()}>
                Log Out
              </Button>
            </div>
          ) : (
            <UserAuthForm isSignup={isSignup} factorTwo={factorTwo} SignInOrUpComponent={() => isSignup ? <SignUp path="/auth/signup" signInUrl="/auth" /> : <SignIn path="/auth" afterSignInUrl="/auth" afterSignUpUrl="/auth/signup" signUpUrl="/auth/signup" />} />
          )}
          {!(sessionId || factorTwo) && (
            <div className="mx-auto mt-10 flex w-full items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                By using Etched, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function UserAuthForm({ className, isSignup, factorTwo, SignInOrUpComponent, ...props }: UserAuthFormProps) {
  const router = useRouter();

  const { isLoaded, userId, sessionId, isSignedIn } = useAuth();
  const { logIn } = useSignIn();
  const [messageState, setMessageState] = React.useState("Verifying Wallet Abstraction...");
  const [threeDots, setThreeDots] = React.useState("...");

  const icons = [<Icons.twitterBrand />, <img src="/images/login/image 451.svg" />, <Icons.facebook />];

  React.useEffect(() => {
    if (sessionId && userId && isLoaded && isSignedIn) {
      logIn({
        isPkp: true,
        callback: setMessageState,
      });
    }
    /*
     * WORK AROUND FOR THIS BUG
     * Clerk: “The <SignUp/> and <SignIn/> components cannot render when a user is already signed in, unless the application allows...
     */

    if (isLoaded && !router.asPath.includes("signup")) router.push("/auth");
  }, [userId, sessionId, isSignedIn, isLoaded, router.asPath]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setThreeDots((prevDots) => {
        const dotCount = (prevDots.length % 3) + 1;
        return ".".repeat(dotCount);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={cn("grid gap-5", className)} {...props}>
      {sessionId ? (
        <div className="flex flex-col justify-center gap-4">
          <span className="text-center">{isSignup ? "Creating your account !" : "Logging you in..."}</span>
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <span className="text-center">
            {messageState}
            {threeDots}
          </span>
        </div>
      ) : // if signUp=1, then it will be a sign up form
        <SignInOrUpComponent />
      }
      {!sessionId && !isSignup && !factorTwo && (
        <>
          <div className="flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-center font-body text-base font-normal text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <form>
            <div className="grid gap-2">
              <ConnectWalletModalButtonWrapper />
            </div>
          </form>
        </>
      )}
    </div>
  );
}
