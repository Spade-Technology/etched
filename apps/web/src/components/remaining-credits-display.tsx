import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Plus } from "lucide-react";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { getStripe } from "@/utils/stripe";

const RemainingCreditsDisplay = () => {
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { data: remainingCredits, isLoading: creditsLoading } = api.user.getUserCreditsRemaining.useQuery();

  const handleBuyCredits = async (priceId: string) => {
    if (!isSignedIn) {
      toast({
        title: "Error",
        description: "You must be signed in to purchase credits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a checkout session on the server
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error('Failed to create checkout session');
      }

      // Load Stripe.js and redirect to checkout
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (creditsLoading) {
    return (
      <Badge variant="outline" className="h-9 px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Badge>
    );
  }

  const getColorClasses = (credits: number) => {
    if (credits <= 1) {
      return "bg-red-500 hover:bg-red-600";
    }
    if (credits < 5) {
      return "bg-orange-500 hover:bg-orange-600";
    }
    return "bg-green-500 hover:bg-green-600";
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        className={`
          h-9 
          rounded-md 
          px-4 
          py-2 
          font-extrabold
          text-sm
          text-white 
          transition-colors 
          ${getColorClasses(Number(remainingCredits))}
        `}
      >
        Credits: {remainingCredits}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <CreditCard className="h-4 w-4" />
                <span>Buy Credits</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleBuyCredits('price_100_credits')}>
            100 Credits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBuyCredits('price_50_credits')}>
            50 Credits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBuyCredits('price_10_credits')}>
            10 Credits
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div >
  );
};

export default RemainingCreditsDisplay;
