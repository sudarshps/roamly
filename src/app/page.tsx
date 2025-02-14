import Navbar from "../app/ui/navbar";
import AppName from "../app/ui/appName";
import Grid from "../app/ui/bentoGrid";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <>
      <div>
        <Navbar logoColor={'text-white'} button={'bg-white'}/>
        <div className="bg-green-700 mx-auto px-6 py-4 min-h-screen text-white flex items-center justify-center">
          <AppName />
          <p></p>
        </div>
      </div>
      <div>
        <Suspense fallback={<Skeleton/>}>
          <Grid />
        </Suspense>
      </div>
    </>
  );
}
