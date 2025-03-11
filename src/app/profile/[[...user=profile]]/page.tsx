import { UserProfile } from "@clerk/nextjs";
import Navbar from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";
import { Suspense } from "react";
import { SkeletonCard } from "@/app/ui/skeletonCard";

export default function Profile() {
  return (
    <div className="bg-green-700">
      <Navbar logoColor="text-white" button="text-white" />
      <div className="flex justify-center items-center py-8">
        <div className="mt-8">
          <Suspense fallback={<SkeletonCard />}>
            <UserProfile path="/profile" />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
