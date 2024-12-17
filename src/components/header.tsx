import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold hover:text-emerald-300 transition-colors">
          Starter Kit
        </Link>
        <nav className="flex space-x-6">
          <Link href="/page/about" className="hover:text-emerald-300 transition-colors">
            About
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="hover:text-emerald-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="hover:text-emerald-300 transition-colors">
              Profile
            </Link>
          </SignedIn>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg transition-colors font-medium">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
