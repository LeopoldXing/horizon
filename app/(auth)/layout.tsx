import React from 'react';
import Image from "next/image";

const AuthLayout = ({children}: { children: React.ReactNode }) => {
  return (
      <div className="w-full min-h-screen flex justify-between font-inter">
        {children}
        <div className="sticky top-0 w-full h-screen flex items-center justify-end bg-sky-1 max-lg:hidden">
          <div>
            <Image src="/icons/auth-image.svg" alt="Auth image" width={500} height={500}/>
          </div>
        </div>
      </div>
  );
};

export default AuthLayout;
