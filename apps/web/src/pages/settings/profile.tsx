// import { DocsSidebarNav } from "@/components/dashboard-side-bar";
import { PageBoilerplate } from "@/components/page-boilerplate";
import { ManageDialog, SidebarDialog } from "@/components/pages/settings";
import { useGetEtchesFromUser } from "@/utils/hooks/useGetEtchesFromUser";
import { useLoggedInAddress } from "@/utils/hooks/useSignIn";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings of the Etched app.",
};

export default function SettingsPage() {
  const loggedInAddress = useLoggedInAddress();
  const { isLoading, etches, error } = useGetEtchesFromUser(loggedInAddress.toLowerCase());

  return (
    <PageBoilerplate>
      <article className="mt-[19px] flex w-full bg-white px-10 py-[34px] shadow-[0px_4px_20px_3px_rgba(0,0,0,0.10)]"></article>
    </PageBoilerplate>
  );
}
