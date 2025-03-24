import Benefits from "@/components/pages/home/benefits";
import Header from "@/components/pages/home/header";
import HomeInfo from "@/components/pages/home/home-info";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Footer from "@/components/ui/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import ForwardArrow from "public/icons/forward-arrow.svg";
import { useEffect, useState } from "react";

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const { mutateAsync, isLoading } = api.user.subscribeToNewsletter.useMutation({});
  const router = useRouter();

  const handleSubscribeToNewsletter = async () => {
    if (!email || !company)
      return toast({
        title: "Missing information",
        description: "Please enter both email and company",
        variant: "destructive",
      });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });

    await mutateAsync({
      email,
      company,
    });

    toast({
      title: "Success!",
      description: "You have been added to the waitlist",
      variant: "success",
    });
  };

  const showWaitlistUsing = (open: boolean | string) => {
    setShowWaitlist(!!open);

    if (typeof open === "string") setEmail(open);
  };



  return (
    <div className="w-full overflow-hidden font-campton">
      <div className="mx-5 md:mx-10 xl:mx-24">
        <Header setShowWaitlist={showWaitlistUsing} />
        <div className="mx-auto text-center align-middle ">
          <WaitlistDialog
            {...{
              showWaitlist,
              showWaitlistUsing,
              email,
              setEmail,
              setCompany,
              isLoading,
              handleSubscribeToNewsletter,
            }}
          />

          <HomeInfo setShowWaitlist={showWaitlistUsing} />
          <Benefits setShowWaitlist={showWaitlistUsing} />
        </div>

        <Footer />
        {/* {showWaitlist && <JoinWaitlist show={showWaitlist} close={() => setShowWaitlist(false)} />} */}
      </div>
    </div>
  );
}

const WaitlistDialog = ({
  showWaitlist,
  showWaitlistUsing,
  email,
  setEmail,
  setCompany,
  isLoading,
  handleSubscribeToNewsletter,
}: {
  showWaitlist: boolean;
  showWaitlistUsing: (open: boolean | string) => void;
  email: string;
  setEmail: (email: string) => void;
  setCompany: (company: string) => void;
  isLoading: boolean;
  handleSubscribeToNewsletter: () => void;
}) => {
  return (
    <Dialog open={showWaitlist} onOpenChange={(x) => showWaitlistUsing(x)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join The Etched Waitlist</DialogTitle>
          {/* <DialogDescription>Secure your spot in our exclusive community</DialogDescription> */}
          <DialogDescription className="pt-5">
            <div className="grid grid-cols-4 items-center gap-4 py-4">
              <Label htmlFor="email" className="text-right">
                Email:
              </Label>
              <Input
                id="email"
                placeholder="example@domain.com"
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company:
              </Label>
              <Input id="company" placeholder="Acme Corp" className="col-span-3" onChange={(e) => setCompany(e.target.value)} />
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button type="submit" isLoading={isLoading} className="mt-5 gap-3 rounded-lg" onClick={handleSubscribeToNewsletter}>
              Join Waitlist <Image src={ForwardArrow} alt="forward" />
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
