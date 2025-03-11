import { UserProfile } from "@clerk/nextjs";
import Navbar from "@/app/ui/navbar";

export default function Profile() {
  return (
    <div className="bg-green-700">
      <Navbar logoColor="text-white" button="text-white" />
      <div className="flex justify-center items-center py-8">
        <div className="mt-16">
        <UserProfile path="/profile"/>
        </div>
      </div>
    </div>
  );
}
