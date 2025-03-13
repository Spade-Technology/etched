import { useState } from "react";
import { api } from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getZodErrorMessages } from "@/utils/common";

export const AdjustEtchedCredits = () => {
  const { toast } = useToast();
  const [creditAdjustments, setCreditAdjustments] = useState<Record<string, string>>({});

  // Query to fetch users
  const { data: clerkResults, isLoading, refetch } = api.user.getAllClerkUsersWithCredits.useQuery({});

  // Mutation for adding credits
  const addCreditsMutation = api.user.addCreditsToUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Credits Added",
        description: "Credits have been successfully added to the user.",
      });
      // Refetch the data to update the UI
      refetch();
    },
    onError: (error: any) => {
      const messages = getZodErrorMessages(error?.data?.zodError);
      toast({
        title: "Error",
        description: JSON.stringify(messages),
        variant: "destructive",
      });
    },
  });

  // Handle credit adjustment submission
  const handleSubmit = async (clerkId: string) => {
    const creditsToAdd = Number(creditAdjustments[clerkId]);
    if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    await addCreditsMutation.mutate({
      clerkId: clerkId,
      credits_to_add: creditsToAdd,
    });

    // Clear the input after submission
    setCreditAdjustments((prev) => ({
      ...prev,
      [clerkId]: "",
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage User Credits</h2>
      <p className="mb-4">Add credits to users. Each credit allows a user to create one file.</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Available Credits</TableHead>
            <TableHead>Add Credits</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clerkResults?.users?.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.primaryMatchedEmailAddress}</TableCell>
              <TableCell>{user.externalId}</TableCell>
              <TableCell>{user.etchedCreditsRemaining}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={creditAdjustments[user.id] || ""}
                  onChange={(e) =>
                    setCreditAdjustments((prev) => ({
                      ...prev,
                      [user.id]: e.target.value,
                    }))
                  }
                  placeholder="Number of credits to add"
                  className="w-32"
                  min="1"
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSubmit(user.id)}
                  disabled={addCreditsMutation.isLoading}
                >
                  {addCreditsMutation.isLoading ? "Adding..." : "Add Credits"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
