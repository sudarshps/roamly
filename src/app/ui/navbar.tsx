"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Kanit } from "next/font/google";
import { IoLogIn } from "react-icons/io5";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const kanit = Kanit({ weight: "700", subsets: ["latin"] });

interface NavbarPropsType {
  logoColor: string;
  button: string;
}

const Navbar = ({ logoColor, button }: NavbarPropsType) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter()

  const name = useAuthStore((state) => state.name)
  const clearUser = useAuthStore((state) => state.clearUser)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearUser()
    signOut()

  }  

  const handleRoute = (url:string) => {
    router.push(url)
  }
  return (
    <nav
      className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
        isScrolled ? "bg-white/30 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link
          href="/"
          className={`text-3xl font-bold ${kanit.className} ${
            isScrolled ? `text-orange-400` : logoColor
          }`}
        >
          Roamly.
        </Link>

        {!name ? (
          <Link href="/login">
            <button
              className={`px-4 py-2 flex items-center gap-2 rounded-md border border-black text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 ${
                isScrolled ? `bg-orange-400` : button
              }`}
            >
              <IoLogIn className="text-xl" />
              Login
            </button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>handleRoute('/myblogs')}>My Blogs</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
