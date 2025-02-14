import { LoginForm } from "@/components/login-form";
import Navbar from "../ui/navbar";

export default function RegisterPage() {
  return (
    <>
      <Navbar logoColor={"text-orange-400"} button={"bg-orange-400"} />

      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl mt-12">
          <LoginForm method={"register"} />
        </div>
      </div>
    </>
  );
}
