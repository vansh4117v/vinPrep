import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, signOut } from "@/lib/actions/auth.action";
import LogoutButton from "@/components/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-top bg-no-repeat opacity-30"></div>

      <div className="relative z-10">
        {/* Modern Navigation */}
        <nav className="flex items-center justify-between py-6 px-8 max-sm:px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.svg"
                  alt="VinPrep Logo"
                  width={32}
                  height={28}
                  className="filter brightness-0 invert"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              VinPrep
            </h2>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-purple-200 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-purple-500/20 font-bold"
            >
              Dashboard
            </Link>
            <Link
              href="/interview"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 font-semibold"
            >
              Start Interview
            </Link>
            <LogoutButton />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
};

export default Layout;
