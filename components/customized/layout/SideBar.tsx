"use client"

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {sidebarLinks} from "@/lib/constants";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Footer from "@/components/customized/layout/Footer";
import PlaidLink from "@/components/customized/PlaidLink";

interface SideBarProps {
  user: User
}

const SideBar = ({user}: SideBarProps) => {
  const currentPath = usePathname();

  return (
      <div className="sticky left-0 top-0 pt-8 h-screen w-fit flex flex-col justify-between border-r border-gray-200 bg-white text-white
                      max-lg:hidden md:p-4 2xl:w-[355px]">
        <nav className="flex flex-col gap-4">
          <Link href="/" className="flex mb-12 items-center gap-2 cursor-pointer">
            <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34} className="size=-[24px] max-lg:size-14"/>
            <h1 className="2xl:text-26 font-ibm-plex-serif text-[26px] font-bold text-black-1 max-md:hidden">Horizon</h1>
          </Link>

          {sidebarLinks.map((link) => {
            let isActive = currentPath === link.route || (currentPath === "/" && currentPath.startsWith(link.route));
            return (
                <Link href={link.route} key={link.label}
                      className={cn("flex gap-3 items-center py-1 sm:p-3 md:p-4 rounded-lg justify-center md:justify-start", {"bg-bank-gradient": isActive})}>
                  <div className="relative size-6">
                    <Image src={link.imgURL} alt={link.label} fill className={cn({"brightness-[3] invert-0": isActive})}/>
                  </div>
                  <p className={cn("text-16 font-semibold text-black-2 max-md:hidden", {"!text-white": isActive})}>{link.label}</p>
                </Link>
            )
          })}

          <PlaidLink user={user}/>
        </nav>
        <Footer user={user}/>
      </div>
  );
};

export default SideBar;
