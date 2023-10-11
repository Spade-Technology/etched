// import { DocsSidebarNav } from "@/components/dashboard-side-bar";
import { DataTable } from "@/components/etches-dashboard-table";
import { PageBoilerplate } from "@/components/page-boilerplate";
import { Button } from "@/components/ui/button";
import { useGetEtchesFromUser } from "@/utils/hooks/useGetEtchesFromUser";
import { useLoggedInAddress } from "@/utils/hooks/useSignIn";

import { refetchContext } from "@/utils/urql";
import { Metadata } from "next";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard of the Etched app.",
};

export default function DashboardPage() {
  const loggedInAddress = useLoggedInAddress();
  const { isLoading, etches, error } = useGetEtchesFromUser(loggedInAddress.toLowerCase());

  return (
    <PageBoilerplate>
      <div className="flex flex-col items-center justify-center">
        <DataTable isLoading={isLoading} data={error ? [] : etches} />
      </div>
    </PageBoilerplate>
  );
}
