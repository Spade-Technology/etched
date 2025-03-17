import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { CommandMenu } from "./command";
import { CreateEtchButton } from "./create-etch-button";
import { CreateOrgDialog } from "./create-org-dialog";
import { CreateTeamDialog } from "./create-team-dialog";
import { EtchedENS } from "./ens-button";
import { UserSettings } from "./sidebar";
import { TeamSelector } from "./team-selector";
import { Icons } from "./ui/icons";
import { useState } from "react";
import Plan from "./ui/plan";
import RemainingCreditsDisplay from "./remaining-credits-display";

import { api } from "@/utils/api";

export const DashboardHeader = () => {
  const { data: remainingCredits, isLoading } = api.user.getUserCreditsRemaining.useQuery();
  const [planModal, setPlanModal] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const icons = [
    { Icon: Icons.userCircle, url: "/dashboard/profile", show: !!isSignedIn },
    { Icon: Icons.bell, show: false },
  ];

  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between gap-2 bg-background pl-6 shadow-4xl">
      {!!remainingCredits && remainingCredits > 0 ? (
        <CreateEtchButton />
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>Please purchase more credits...</p>
      )}
      <RemainingCreditsDisplay />
      {/* <CommandMenu /> */}

      <div className="mx-6 flex h-full w-fit items-center gap-6 border-l pl-6">
        {/* Etched ENS */}
        <EtchedENS />
        {/* <TeamSelector horizontal={true} className="w-fit py-2" /> */}
      </div>

      {/* Modals & More */}
      <CreateTeamDialog />
      <CreateOrgDialog />
      <Plan isOpen={planModal} setIsOpen={setPlanModal} />

      <div className="flex h-full">
        <div className="h-full border-l " />
        {icons
          .filter((icon) => icon.show)
          .map(({ Icon, url }, idx) => (
            <div className="flex" key={idx}>
              <div
                onClick={() => (url ? router.push(url) : null)}
                className="relative flex h-full w-16 cursor-pointer items-center justify-center"
              >
                <Icon color={pathname == url ? "#097B45" : ""} />
                <div
                  className={`absolute bottom-0 left-0 h-1.5 w-16 rounded-tl-full rounded-tr-full bg-green-700 duration-500 ${
                    pathname == url ? "visible" : "invisible"
                  }`}
                />
              </div>
              {idx < 1 && <div className="h-full border-l" />}
            </div>
          ))}
        <div className="h-full border-l" />
        <UserSettings>
          <div className="relative flex h-full w-16 cursor-pointer items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              aria-roledescription="more menu"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-12 w-12 rounded-lg py-2 text-foreground/40 lg:px-3"
              strokeLinecap="round"
              strokeLinejoin="round"
              // className="lucide lucide-more-horizontal"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </div>
        </UserSettings>
      </div>
    </div>
  );
};
