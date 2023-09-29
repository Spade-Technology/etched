import { Button } from "@/components/ui/button";
import CustomModal from "@/components/ui/customModal";
import Image from "next/image";
import ForwardArrow from "public/icons/forward-arrow.svg";

interface WaitlistProps {
  show: boolean;
  close: () => void;
}
const JoinWaitlist = ({ show, close }: WaitlistProps) => {
  return (
    <CustomModal show={show} close={close}>
      <div className="py-5 md:p-5">
        <div className="p-2 text-lg flex justify-between gap-2 md:gap-5">
          Email : <input placeholder="Enter valid Mail" className="rounded-lg border-[1px] border-black px-2 md:px-5 py-2 outline-none" />
        </div>
        <div className="p-2 text-lg flex justify-between gap-2 md:gap-5">
          Company : <input placeholder="Enter Company Name" className="rounded-lg border-[1px] border-black px-2 md:px-5 py-2 outline-none" />
        </div>

        <div
          // onClick={() => router.push("/authentication")}
          onClick={close}
          className="mx-auto my-5 flex w-fit cursor-pointer gap-3 rounded-3xl bg-[#097B45] px-7 py-3  font-semibold text-white"
        >
          Join Waitlist
          <Image src={ForwardArrow} alt="forward" />
        </div>
      </div>
    </CustomModal>
  );
};

export default JoinWaitlist;