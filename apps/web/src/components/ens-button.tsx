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
import { contracts } from "@/contracts";
import ENSAbi from "@/contracts/abi/EtchENS.json";
import { api } from "@/utils/api";
import { shortenAddress } from "@/utils/hooks/address";
import { useLoggedInAddress } from "@/utils/hooks/useSignIn";
import { useState } from "react";
import { useContractRead } from "wagmi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";

export const EtchedENS = () => {
  const toast = useToast();

  const [etched, setEtched] = useState("");
  const loggedInAddress = useLoggedInAddress();

  const {
    isLoading,
    data: _ens,
    refetch,
  } = useContractRead({
    abi: ENSAbi,
    address: contracts.ENS,
    functionName: "getENS",
    args: [loggedInAddress],
    enabled: !!loggedInAddress,
  });
  const ens = (_ens as string[]) || undefined;

  const { mutate, isLoading: isMutationLoading } = api.ens.requestEtchedENS.useMutation({
    onSuccess: (data) => {
      toast.toast({
        title: "Success!",
        description: "Your ENS has been claimed. You've received your NFT ENS !",
        variant: "success",
      });
      refetch();
    },
  });

  const [copiedState, setCopiedState] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(ens?.[0] || "");
    toast.toast({ title: "Copied!", description: "Your ENS has been copied to your clipboard.", variant: "default" });
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 1000);
  };

  return isLoading || ens?.length > 0 ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className="flex  cursor-pointer items-center gap-2 rounded-md border-[1.5px] border-input px-4 py-2"
            onClick={copy}
          >
            <EtchedWalletIcon />
            {isLoading ? (
              <Skeleton className="h-[10px] w-20 rounded-full" />
            ) : (
              <>
                <span className="text-sm font-medium text-primary opacity-0">{ens?.[0]}</span>

                <div className="group/etched relative flex items-center justify-center dark:font-bold ">
                  <span
                    className={
                      "absolute -translate-x-1/2 text-sm text-primary transition-opacity group-hover/etched:opacity-0 " +
                      (copiedState && "!opacity-0")
                    }
                  >
                    {ens?.[0]}
                  </span>
                  <span
                    className={
                      "absolute -translate-x-1/2 text-sm text-primary opacity-0 transition-opacity group-hover/etched:opacity-100 " +
                      (copiedState && "!opacity-0")
                    }
                  >
                    {loggedInAddress && shortenAddress({ address: loggedInAddress })}
                  </span>
                  <span
                    className={
                      "absolute -translate-x-1/2 text-sm text-primary opacity-0 transition-opacity " +
                      (copiedState && "!opacity-100")
                    }
                  >
                    Copied
                  </span>
                </div>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>Copy</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="flex !w-[180px] items-center gap-2 rounded-md border-[1.5px] border-input px-4 py-2">
          <EtchedWalletIcon />
          <span className="text-sm font-medium text-primary">Claim Etched ID</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Claim your Etched ENS !</AlertDialogTitle>
          <AlertDialogDescription>You can only do this once, so make sure your ENS is the one you want!</AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Label htmlFor="username">Etched ENS</Label>
          <div className="flex items-center gap-2">
            <Input onChange={(event) => setEtched(event.target.value)} placeholder="lance1" /> .etched
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button isLoading={isMutationLoading} onClick={() => mutate({ ens: etched + ".etched" })}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EtchedWalletIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
      <path
        d="M20.4937 12.6071H16.3704C14.8564 12.6062 13.6292 11.3799 13.6283 9.86592C13.6283 8.35192 14.8564 7.12568 16.3704 7.12476H20.4937"
        stroke="#9C9C9C"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.8373 9.80322H16.5195" stroke="#9C9C9C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.34495 1H15.1486C18.1005 1 20.4936 3.39307 20.4936 6.34495V13.655C20.4936 16.6069 18.1005 19 15.1486 19H6.34495C3.39307 19 1 16.6069 1 13.655V6.34495C1 3.39307 3.39307 1 6.34495 1Z"
        stroke="#9C9C9C"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.62012 5.62207H11.1192" stroke="#9C9C9C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
