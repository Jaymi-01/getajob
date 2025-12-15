"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import AuthStatus from "./AuthStatus";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col items-center pt-10 gap-4">
          <Link href="/jobs" className="text-lg font-bold text-gray-600 hover:text-black">
            Jobs
          </Link>
          <Link href="/companies" className="text-lg font-bold text-gray-600 hover:text-black">
            Companies
          </Link>
          <div>
            <AuthStatus isMobile={true} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}