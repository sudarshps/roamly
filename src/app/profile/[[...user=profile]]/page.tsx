import { UserProfile } from "@clerk/nextjs";
import Navbar from "@/app/ui/navbar";

export default function Profile() {
  return (
    <>
      <Navbar logoColor="text-black" button="text-white" />
      <div className="flex justify-center items-center py-8 mt-20">
        <UserProfile path="/profile" />
      </div>
    </>
  );
}
