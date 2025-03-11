import Navbar from "../app/ui/navbar";
import AppName from "../app/ui/appName";
import Grid from "../app/ui/bentoGrid";
import { Suspense } from "react";
import { SkeletonCard } from "./ui/skeletonCard";
import Footer from "./ui/footer";

export default function Home() {
  return (
    <>
      <div>
        <Navbar logoColor={'text-white'} button={'bg-white'}/>
        <div className="bg-green-700 mx-auto px-6 py-4 min-h-screen text-white flex items-center justify-center">
          <AppName />
        </div>
      </div>
      <div>
        <Suspense fallback={<SkeletonCard/>}>
          <Grid />
        </Suspense>
      </div>
      <Footer/>
    </>
  );
}
