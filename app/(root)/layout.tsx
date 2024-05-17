import React from 'react';
import SideBar from "@/components/customered/layout/SideBar";

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
        {children}
      </main>
  );
};

export default RootLayout;
