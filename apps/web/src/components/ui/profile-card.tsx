import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isEVMAddress, shortenAddress } from "@/utils/hooks/address";
import Image from "next/image";
import { EtchedAvatar } from "../pages/etch/edit/components/comments";
import { Button } from "./button";
import { Icons } from "./icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

type ProfileProps = {
  image?: any;
  name?: string;
  link?: string;
  role?: string;
  uid?: string;
  dropDownOn?: boolean;
  dropDownItems?: string[];
};

const ProfileCard = ({ image, name, link = "", uid = "", role, dropDownOn, dropDownItems }: ProfileProps) => {
  return (
    <div className="py-1">
      <div className="flex justify-between gap-24">
        <div className="flex justify-between">
          {image ? <Image src={image} alt="placeholder" /> : <EtchedAvatar uid={uid} />}
          <div className="px-2">
            <div>{name}</div>
            {isEVMAddress(link) ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`https://polygonscan.com/address/${link}`} target="_blank" rel="noopener noreferrer">
                      {shortenAddress({ address: link })}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div>{link}</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div>{link}</div>
            )}
          </div>
        </div>
        {dropDownOn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                className="float-right flex justify-between gap-2 border-none bg-transparent text-[#6D6D6D]"
              >
                {role ? role : dropDownItems && dropDownItems[0]} <Icons.dropdownIcon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[500px] items-start">
              <DropdownMenuGroup>
                {dropDownItems?.map((item, idx) => {
                  return (
                    <DropdownMenuItem key={idx} textValue="Jim Carlos">
                      <Button className="float-right flex justify-between gap-2 border-none bg-transparent text-[#6D6D6D]">
                        {item} <Icons.dropdownIcon />
                      </Button>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="justify-end">{role ? role : ""}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
