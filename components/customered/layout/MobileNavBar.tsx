"use client"

import React from 'react';
import {Sheet, SheetClose, SheetContent, SheetTrigger,} from "@/components/ui/sheet";
import Image from "next/image";
import {sidebarLinks} from "@/lib/constants";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

type MobileNavBarProps = {
  user: User
}

const MobileNavBar = ({user}: MobileNavBarProps) => {
  const currentPath = usePathname();

  return (
      <div className="w-fulll max-w-[264px]">
        <Sheet>
          <SheetTrigger>
            <Image src="/icons/hamburger.svg" alt="Menu hamburger" width={30} height={30} className="cursor-pointer"/>
          </SheetTrigger>
          <SheetContent side="left" className="border-0 bg-white">
            <Link href="/" className="px-4 flex items-center gap-1 cursor-pointer">
              <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34}/>
              <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
            </Link>
            <div className="h-[calc(100vh-72px)] flex flex-col justify-between overflow-y-auto">
              <SheetClose asChild>
                <nav className="h-full pt-16 flex flex-col gap-6 text-white">
                  {sidebarLinks.map((link) => {
                    const isActive = currentPath === link.route || (currentPath === "/" && currentPath.startsWith(link.route));
                    return (
                        <SheetClose asChild key={link.route}>
                          <Link href={link.route}
                                className={cn("w-full max-w-60 p-4 flex items-center gap-4 rounded-lg", {"bg-bank-gradient": isActive})}>
                            <Image src={link.imgURL} alt={link.label} width={20} height={20}
                                   className={cn({"brightness-[3] invert-0": isActive})}/>
                            <p className={cn("text-16 font-semibold text-black-2", {"text-white": isActive})}>{link.label}</p>
                          </Link>
                        </SheetClose>
                    )
                  })}

                  User
                </nav>
              </SheetClose>

              <footer>Footer</footer>
            </div>
          </SheetContent>
        </Sheet>

      </div>
  );
};

export default MobileNavBar;
