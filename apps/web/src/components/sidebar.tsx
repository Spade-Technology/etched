import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLoggedInAddress, useSignOut } from "@/utils/hooks/useSignIn";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { LogoAnimated } from "./icons/logo-long-animated";
import { Icons } from "./ui/icons";

const sideBarElementCn =
  "cursor-pointer relaive text-base flex flex-col max-lg:mx-auto items-center justify-center max-lg:px-5 px-3 max-lg:w-fit py-5 text-[#9C9C9C] duration-300 hover:bg-muted dark:hover:bg-muted-foreground";

const activeClassName =
  sideBarElementCn +
  "cursor-pointer !bg-primary/10 !text-primary before:absolute max-lg:rounded-lg before:left-0 font-semibold before:h-24 before:w-8 before:-translate-x-1/2 before:rounded-full lg:before:bg-primary";

enum activePage {
  DASHBOARD,
  ETCH_LIBRARY,
  MARKETPLACE,
  COMMUNITY,
  SETTINGS,
}

export const SideBar = () => {
  const router = useRouter();
  const [tooltip, setTooltip] = useState("");

  const loggedInAddress = useLoggedInAddress();

  const path = router.asPath;
  const pages = [
    { url: "/dashboard", title: "Dashboard", Icon: Icons.dashboard },
    { url: "/dashboard/manage", title: "Organisation", Icon: Icons.organisation, disabled: true },
    { url: "/dashboard/etch-library", title: "Etch Library", Icon: Icons.etchLibrary, disabled: true },
    { url: "/dashboard/marketplace", title: "Marketplace", Icon: Icons.marketplace, disabled: true },
    { url: "/dashboard/community", title: "Community", Icon: Icons.community, disabled: true },
  ];

  const activePageIndex = pages.findIndex(({ url }) => url === path) === -1 ? 0 : pages.findIndex(({ url }) => url === path);

  return (
    <aside id="sidebar" className="sticky left-0 top-0 z-10 h-screen w-fit transition-transform lg:w-52" aria-label="Sidebar">
      <div className="custom-scrollbar flex h-full flex-col overflow-y-auto bg-background pb-4 pt-8 dark:border-muted-foreground max-lg:px-3">
        <LogoAnimated onClick={() => router.push("/dashboard")} className="mx-auto mb-10 max-lg:w-24" />
        <ul className="my-auto space-y-2 text-sm font-medium">
          {pages.map(({ url, title, Icon, disabled }, index) => {
            return (
              <li key={title} className="pr-1 max-xl:pr-0">
                <Link
                  onMouseOver={() => setTooltip(title)}
                  onMouseOut={() => setTooltip("")}
                  className={
                    index === activePageIndex ? activeClassName : sideBarElementCn + (disabled ? " cursor-context-menu" : "")
                  }
                  href={""}
                  onClick={disabled ? (e) => e.preventDefault() : () => router.push(url)}
                >
                  <Icon
                    color={index === activePageIndex ? "rgb(var(--primary))" : "rgb(var(--foreground), 0.5)"}
                    className="h-6 w-6"
                  />

                  <span className="mt-2 hidden whitespace-nowrap lg:block">{title}</span>

                  <div
                    className={`absolute left-20 ${
                      disabled ? "w-56 cursor-help lg:left-44" : " w-36"
                    } z-10 ml-3 flex items-center duration-300 group-hover:flex ${
                      tooltip == title
                        ? `visible scale-100 opacity-100 ${disabled ? "" : " lg:hidden"}`
                        : "invisible scale-50 opacity-0"
                    }`}
                  >
                    <div className={`-mr-2 h-3 w-3 rotate-45 ${disabled ? "bg-muted-foreground" : " bg-primary"}`}></div>
                    <div
                      className={`${
                        disabled ? "rounded bg-muted-foreground px-3 py-2" : "bg-primary p-2"
                      } z-10 flex w-fit text-white shadow-lg`}
                    >
                      {disabled ? (
                        <div>
                          <b>Feature coming soon</b> <br /> Please check back later for updates.
                        </div>
                      ) : (
                        title
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto"></div>
      </div>
    </aside>
  );
};

export function UserSettings({ children }: { children: React.ReactNode }) {
  const { signOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="mr-3 w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
