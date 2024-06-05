export const dynamic = "force-dynamic";

import React from 'react';
import SideBar from "@/components/customized/layout/SideBar";
import Image from "next/image";
import MobileNavBar from "@/components/customized/layout/MobileNavBar";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";

const RootLayout = async ({children}: { children: React.ReactNode }) => {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    redirect("/sign-in");
  }

  return (
      <main className="w-full h-screen flex font-inter">
        <SideBar user={loggedInUser}/>

        <div className="flex flex-col size-full">
          <div className="h-16 p-5 flex items-center justify-between shadow-creditCard sm:p-8 md:hidden">
            <Image src="/icons/logo.svg" alt="Menu Logo" width={30} height={30}/>
            <div>
              <MobileNavBar user={loggedInUser}/>
            </div>
          </div>
          {children}
        </div>
      </main>
  );
};

export default RootLayout;
