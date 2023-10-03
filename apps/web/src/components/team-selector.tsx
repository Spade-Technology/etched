import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/utils/api";
import { shortenAddress } from "@/utils/hooks/address";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import ENSAbi from "@/contracts/abi/EtchENS.json";
import { contracts } from "@/contracts";
import { useQuery } from "@/gqty";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TeamSelector = () => {
  const { data: session, status } = useSession();

  const [selectedBehalfOf, setSelectedBehalfOf] = useState({ name: "Myself", org: "Personhood" });

  const query = useQuery({});
  const teams = query.teams({
    where: {
      or: [
        {
          ownership_: {
            owner: session?.address?.toLowerCase(),
          },
        },
        {
          permissions_: {
            wallet: session?.address?.toLowerCase(),
            permissionLevel_gt: 0,
          },
        },
      ],
    },
  });

  const behalfOf = teams
    .map((team) => ({
      name: "Team " + team.teamId,
      org: team.ownership.organisation?.orgId ?? "Sole Team",
      teamId: team.teamId,
    }))
    .filter((team) => !!team.teamId);

  const Organisations = behalfOf.map((team) => team.org);

  return (
    <Select onValueChange={(e) => console.log(e)}>
      <SelectTrigger className="#ring-0 h-full w-[180px] !border-0  !ring-0 ">
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-semibold text-gray-800">{selectedBehalfOf.name}</span>
          <span className="text-xs text-gray-500">{selectedBehalfOf.org}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Myself">Myself</SelectItem>
          <SelectSeparator className="SelectSeparator" />
          {Organisations.map((org, index) => (
            <>
              <SelectGroup key={index}>
                <SelectLabel>{org}</SelectLabel>
                {behalfOf
                  .filter((team) => team.org === org && team.teamId)
                  .map((team, index) => (
                    <SelectItem key={index} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectSeparator className="SelectSeparator" />
            </>
          ))}
        </SelectGroup>
        <SelectGroup className="flex flex-col">
          <SelectLabel>Actions</SelectLabel>
          <Button variant={"ghost"} className="flex w-full justify-start rounded-sm p-2">
            New Team
          </Button>
          <Button variant={"ghost"} className="flex w-full justify-start rounded-sm p-2">
            New Orgnisation
          </Button>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
