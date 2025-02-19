"use client";

import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/verifyEmail", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message);
          router.push("/register");
          return;
        }

        router.push("/");
      } catch (error) {
        console.error("Failed to verify email:", error);
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <CircularProgress style={{ color: "#32cd32" }} size={80} />
        <h1>Verifying Link...Please Wait...</h1>
      </div>
    </>
  );
}
