import React from 'react';
import SideBar from "@/components/customized/layout/SideBar";
import Image from "next/image";
import MobileNavBar from "@/components/customized/layout/MobileNavBar";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";

const RootLayout = async ({children}: { children: React.ReactNode }) => {
  const loggedInUser = await getLoggedInUser();
  let firstName = "";
  let lastName = "";
  if (loggedInUser) {
    let name = loggedInUser.name;
    firstName = name.split(" ")[0];
    lastName = name.split(" ")[1];
  } else {
    redirect("/sign-in");
  }

  const loginInfo = {
    user: {...loggedInUser, firstName: firstName, lastName: lastName}
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
