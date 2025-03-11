"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Kanit } from "next/font/google";
import { IoLogIn } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignInButton,useSession,SignOutButton,useUser } from "@clerk/nextjs";

const kanit = Kanit({ weight: "700", subsets: ["latin"] });

interface NavbarPropsType {
  logoColor: string;
  button: string;
}

const Navbar = ({ logoColor, button }: NavbarPropsType) => {
  const {isSignedIn} = useSession()
  const [isScrolled, setIsScrolled] = useState(false);
  const {user} = useUser()
  const profileImg = user?.imageUrl  
  const userName = user?.firstName

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



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

        {!isSignedIn ? (
          <>
          <SignInButton mode="modal">
            <button
              className={`px-4 py-2 flex items-center gap-2 rounded-md border border-black text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 ${
                isScrolled ? `bg-orange-400` : button
              }`}
            >
              <IoLogIn className="text-xl" />
              Login
            </button>
          </SignInButton>
          </>
          
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={profileImg} />
                <AvatarFallback>{userName?userName.slice(0,1):'IMG'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <Link href={'/profile'}><DropdownMenuItem className="hover:cursor-pointer">Profile</DropdownMenuItem></Link>
              <Link href={'/createblog'}><DropdownMenuItem className="hover:cursor-pointer">Write Blog</DropdownMenuItem></Link>
              <Link href={'/myblogs'}><DropdownMenuItem className="hover:cursor-pointer">My Blogs
              </DropdownMenuItem></Link>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <SignOutButton><DropdownMenuItem className="hover:cursor-pointer">Sign Out</DropdownMenuItem></SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
