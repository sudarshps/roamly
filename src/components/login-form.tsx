"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

type MethodType = "login" | "register";

interface LoginFormProps extends React.ComponentProps<"div"> {
  method?: MethodType;
}

export function LoginForm({ className, method, ...props }: LoginFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTokenGenereted,setIsTokenGenerated] = useState(false)
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user && !isTokenGenereted) {
      const email = session.user.email;
      const password = '123456'
      
      const generateToken = async () => {        
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ email,password }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setIsTokenGenerated(prev=>!prev)
        setUser(data.token, data.name);

        router.push("/");


      };
      generateToken()
    }
  }, [session,isTokenGenereted,setUser,router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }
    Swal.fire({
      title: "Success",
      text: "Registered Successfully!",
      icon: "success",
    });
    router.push("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    setUser(data.token, data.name);
    router.push("/");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ToastContainer />

      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {method === "register" && (
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/vecteezy_bali-holiday-trip_36670298.jpg"
                layout="fill"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          )}
          <form
            className="p-6 md:p-8"
            onSubmit={method === "login" ? handleLogin : handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  {method === "register" ? `Welcome` : `Welcome back`}
                </h1>
                <p className="text-balance text-muted-foreground">
                  {method === "register"
                    ? `Register Roamly. free!`
                    : `Login to your Roamly.`}
                </p>
              </div>
              {method === "register" ? (
                <div className="grid gap-2">
                  <Label htmlFor="name">Username</Label>
                  <Input
                    id="name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="string"
                    placeholder="Wayne"
                  />
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="wayne@example.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {method === "login" ? (
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  ) : null}
                </div>
                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>
              <Button type="submit" className="w-full">
                {method === "login" ? `Login` : `Register`}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn("google")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>
                    {method === "register" ? `Register` : `Login`} with Google
                  </span>
                </Button>
              </div>
              {method === "login" ? (
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              ) : (
                <div className="text-center text-sm">
                  have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              )}
            </div>
          </form>
          {method === "login" && (
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/vecteezy_traveling-to-the-whole-world-happily_9196914.svg"
                layout="fill"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
