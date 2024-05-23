import React from 'react';
import Image from "next/image";
import {signOut} from "@/lib/actions/user.actions";
import {useRouter} from "next/navigation";

const Footer = ({user, type = "desktop"}: { user: User, type?: "desktop" | "mobile" }) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const res = await signOut();

    if (res) {
      router.replace("/sign-in");
    }
  };
  return (
      <footer className="py-6 flex justify-between items-center gap-2 cursor-pointer">
        {/*  footer name  */}
        <div className={"size-10 flex items-center justify-center rounded-full bg-gray-200" + (type === "desktop" && "max-xl:hidden")}>
          <p className="text-xl font-bold text-gray-700">
            {user.firstName[0]}
          </p>
        </div>

        {/*  footer email  */}
        <div className={"flex flex-1 flex-col justify-center" + (type === "desktop" && "max-xl:hidden")}>
          <h1 className="text-14 text-gray-700 truncate font-semibold">{user.name}</h1>
          <p className="text-14 text-gray-600 truncate font-normal">{user.email}</p>
        </div>

        {/*  footer image  */}
        <div
            className={"relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center" + (type === "desktop" && "ml-16")}
            onClick={handleLogOut}>
          <Image src="icons/logout.svg" fill alt="logout"/>
        </div>
      </footer>
  );
};

export default Footer;
