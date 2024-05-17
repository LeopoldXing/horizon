import React from 'react';
import SideBar from "@/components/customered/layout/SideBar";
import Image from "next/image";
import MobileNavBar from "@/components/customered/layout/MobileNavBar";

const RootLayout = ({children}: { children: React.ReactNode }) => {
  const loginInfo = {
    user: {
      firstName: "Leopold",
      lastName: "Hsing"
    }
  }

  return (
      <main className="w-full h-screen flex font-inter">
        <SideBar user={loginInfo.user}/>

        <div className="flex flex-col size-full">
          <div className="h-16 p-5 flex items-center justify-between shadow-creditCard sm:p-8 md:hidden">
            <Image src="/icons/logo.svg" alt="Menu Logo" width={30} height={30}/>
            <div>
              <MobileNavBar user={loginInfo.user}/>
            </div>
          </div>
          {children}
        </div>
      </main>
  );
};

export default RootLayout;
