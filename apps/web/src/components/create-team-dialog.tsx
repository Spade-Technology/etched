import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useQuery } from "urql";
import * as z from "zod";
import { Button } from "./ui/button";

import { SelectValue } from "@radix-ui/react-select";

import { graphql } from "@/gql";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger } from "./ui/select";
import { toast } from "./ui/use-toast";
import { useLoggedInAddress } from "@/utils/hooks/useSignIn";
import { Organisation } from "@/gql/graphql";

const formSchema = z.object({
  teamName: z.string(),
  teamMembers: z.array(z.string()),
  teamOrganisation: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const ORGANISATIONS_QUERY = graphql(/* GraphQL */ `
  query Organisations($address: String!) {
    organisations(
      where: { or: [{ ownership_: { owner: $address } }, { permissions_: { wallet: $address, permissionLevel_gt: 0 } }] }
    ) {
      orgId
      id
      name
    }
  }
`);

export const CreateTeamDialog = ({ children }: { children?: React.ReactNode }) => {
  const [state, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isLoading } = api.team.createTeam.useMutation();

  const loggedInAddress = useLoggedInAddress();

  const [{ data, fetching }, refetch] = useQuery({
    query: ORGANISATIONS_QUERY,
    variables: { address: loggedInAddress.toLowerCase() },
  });
  const organisations: Organisation[] = data ? data.organisations : [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      teamName: "",
      teamMembers: [],
      teamOrganisation: "None",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({
        teamName: data.teamName,
        teamMembers: data.teamMembers,
        owningOrg: data.teamOrganisation,
        blockchainSignature: localStorage.getItem("blockchainSignature")!,
        blockchainMessage: localStorage.getItem("blockchainMessage")!,
      });
      toast({
        title: "Team created",
        description: "Your team has been created",
        variant: "success",
      });
      // setIsOpen(false);
    } catch (e) {
      console.log(e);
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    document.addEventListener("create-team", () => {
      setIsOpen(true);
    });
  }, []);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent className={"max-h-screen overflow-y-scroll lg:max-w-screen-lg"}>
        <div className="w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Team</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-2 flex flex-col gap-2 md:flex-row">
                <div className="flex w-full flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem>
                        <FormLabel>Public Team Title</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} id="etchTitle" placeholder="Enter the Team title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamOrganisation"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem>
                        <FormLabel>Where should this team be created ?</FormLabel>
                        <FormControl>
                          <Select {...field} onValueChange={(v) => field.onChange(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="None">No Organisation</SelectItem>
                                <SelectSeparator className="SelectSeparator" />
                                {!fetching &&
                                  organisations?.[0]?.id &&
                                  organisations.map(
                                    (org, index) =>
                                      org.orgId && (
                                        <div key={index}>
                                          <SelectItem key={index} value={org.orgId}>
                                            {org.name ?? org.id}
                                          </SelectItem>
                                        </div>
                                      )
                                  )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="my-8 text-center text-2xl">WORK IN PROGRESS: Create the Members selector</div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading} onClick={() => setIsOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <Button isLoading={isLoading} type="submit">
                  Create Team
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
