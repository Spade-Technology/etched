import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { SideBar } from "./sidebar";
import { WorkQueue } from "./work-queue";

export const PageBoilerplate = ({ children }: { children: React.ReactNode }) => {
  // maybe a bit extra, should do the trick though, right
  useVerifyAuth();

  // check for mobile aspect ratio
  // const [isMobile, setIsMobile] = useState(false);
  // useEffect(() => {
  //   if (window.innerWidth / window.innerHeight < 1) setIsMobile(true);
  // }, []);

  // if (isMobile) {
  //   return (
  //     <div className="flex h-screen w-screen flex-col bg-white">
  //       Etched is not supported on mobile devices yet. Please use a desktop browser.
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen w-screen bg-white">
      <SideBar />
      <div className="w-full pl-2 pr-3 pt-3">
        <DashboardHeader />
        <WorkQueue />
        {children}
      </div>
    </div>
  );
};

export const useVerifyAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status == "unauthenticated") router.push("/authentication");
  }, []);
};
