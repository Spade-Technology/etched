import React, { useState } from "react";
import { CreateOrgDialog } from "@/components/create-org-dialog";
import { CreateTeamDialog } from "@/components/create-team-dialog";
import { useLoggedInAddress } from "@/utils/hooks/useSignIn";
import { useGetTeamsFromUser } from "@/utils/hooks/useGetTeamsFromUser";
import { useGetOrgsFromUser } from "@/utils/hooks/useGetOrgsFromUser";
import { Teams } from "./Teams";
import { OrgDialog } from "./OrgDialog";

export const ManageDialog = () => {
  const [openOrgModal, setOpenOrgModal] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [accordion, setAccordion] = useState("");
  const loggedInAddress = useLoggedInAddress();
  const { organisations } = useGetOrgsFromUser(loggedInAddress.toLowerCase());

  const { teams } = useGetTeamsFromUser(loggedInAddress.toLowerCase());

  const buttons = [{ name: "+ Create Organization" }, { name: "+ Create Team" }];

  return (
    <article className="ml-[25px] flex min-h-screen w-full flex-col gap-7 border-l-[1px] border-[#E0E0E0] pl-5 lg:pl-[60px]">
      {/*------------- Modals & More -------------*/}
      <CreateTeamDialog openTeamModal={openTeamModal} setOpenTeamModal={setOpenTeamModal} />
      <CreateOrgDialog openOrgModal={openOrgModal} setOpenOrgModal={setOpenOrgModal} />
      <header className="flex gap-5">
        {buttons.map(({ name }, idx) => {
          return (
            <div
              key={idx}
              onClick={() => (idx == 0 ? setOpenOrgModal(true) : setOpenTeamModal(true))}
              className={`flex h-fit cursor-pointer items-center gap-3 border-[1px] border-primary px-5 py-[11px] text-base font-semibold text-primary shadow-[0px_4px_13px_0px_rgba(0,0,0,0.25)] duration-300 hover:bg-primary hover:text-white `}
            >
              {name}
            </div>
          );
        })}
      </header>

      {organisations.length > 0 ||
        [1, 2, 3].map((item, idx) => (
          <div key={idx} className="h-[105px] w-full bg-white px-10 shadow">
            <div className="flex h-full animate-pulse items-center gap-5 ">
              <div className="h-6 w-2/12 rounded-md bg-gray-300 "></div>
              <div className="h-6 w-4/12 rounded-md bg-gray-300 "></div>
              <div className="ml-auto h-6 w-4/12 rounded-md bg-gray-300 "></div>
            </div>
          </div>
        ))}

      {organisations?.map(({ id, orgId, name, createdAt }) => {
        const prop = {
          id,
          orgId,
          name,
          date: new Date(+createdAt * 1000).toDateString(),
          teams: teams?.filter(({ ownership }) => ownership?.organisation?.name === name),
          accordion,
          setAccordion,
          organisations,
        };
        return <OrgDialog {...prop} />;
      })}
      <Teams
        name={"MySelf"}
        accordion={accordion}
        setAccordion={setAccordion}
        teams={teams?.filter(({ ownership }) => !ownership?.organisation)}
        organisations={organisations}
      />
    </article>
  );
};