import Link from "next/link";
import AuthStatus from "./AuthStatus";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold cursor-pointer">
          GetaJob
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Link href="/jobs" className="text-gray-600 hover:text-black cursor-pointer">
              Jobs
            </Link>
            <Link href="/companies" className="text-gray-600 hover:text-black cursor-pointer">
              Companies
            </Link>
          </nav>
          <AuthStatus isMobile={false} />
        </div>
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}