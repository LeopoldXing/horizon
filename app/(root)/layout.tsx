import React from 'react';
import SideBar from "@/components/customered/layout/SideBar";

const RootLayout = ({children}: { children: React.ReactNode }) => {
  return (
      <main>
        <SideBar/>
        {children}
      </main>
  );
};

export default RootLayout;
