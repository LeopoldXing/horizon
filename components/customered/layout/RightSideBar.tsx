import React from 'react';
import Link from "next/link";
import Image from "next/image";
import BankCard from "@/components/customered/BankCard";
import {account1, account2} from "@/lib/constants";

type RightSideBarProps = {
  user: User;
  transactionList: Array<Transaction>;
  bankList: Array<Bank>;
}

const RightSideBar = ({user, transactionList, bankList}: RightSideBarProps) => {
  return (
      <aside className="w-[335px] h-screen max-h-screen hidden flex-col border-l border-gray-200 no-scrollbar
                        xl:flex xl:overflow-y-scroll">
        <div className="flex flex-col pb-8">
          {/*  profile banner  */}
          <div className="h-[120px] w-full bg-gradient-mesh bg-cover bg-no-repeat"/>
          {/*  profile  */}
          <div className="relative px-6 flex max-xl:justify-center">
            {/*  profile image  */}
            <div
                className="absolute -top-8 p-2 size-24 flex justify-center items-center bg-gray-100 border-8 border-white rounded-full shadow-profile">
              <span className="text-5xl text-blue-500 font-bold">{user.firstName[0]}</span>
            </div>
            <div className="flex flex-col pt-24">
              <h1 className="text-24 font-semibold text-gray-900">{`${user.firstName}${user.lastName ? " " + user.lastName : ""}`}</h1>
              <p className="text-16 font-normal text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 flex flex-col justify-between gap-8">
          <div className="w-full flex justify-between">
            <h2 className="text-18 font-semibold text-gray-900">My Banks</h2>
            {/*  add bank  */}
            <Link href="/" className="flex gap-2">
              <Image src="/icons/plus.svg" alt="plus icon" width={20} height={20}/>
              <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
            </Link>
          </div>

          {/*  bank list  */}
          {Array.isArray(bankList) && bankList.length > 0 && (
              <div className="relative flex flex-col flex-1 justify-center items-center gap-5">
                <div className="relative z-10">
                  <BankCard key={"1"} userName="Leopold Hsing" account={account1} showBalance={false}/>
                </div>
                {bankList[1] && (
                    <div className="absolute right-0 top-8 z-0 w-[90%]">
                      <BankCard key={"2"} userName="Leopold Hsing" account={account2} showBalance={false}/>
                    </div>
                )}
              </div>
          )}
        </div>
      </aside>
  );
};

export default RightSideBar;
