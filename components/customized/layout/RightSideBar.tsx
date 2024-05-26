import React from 'react';
import Link from "next/link";
import Image from "next/image";
import BankCard from "@/components/customized/BankCard";
import {countTransactionCategories} from "@/lib/utils";
import Category from "@/components/customized/Category";

type RightSideBarProps = {
  user: User;
  transactionList: Array<Transaction>;
  bankList: Array<Account>;
}

const RightSideBar = ({user, transactionList, bankList}: RightSideBarProps) => {
  const categoryList = countTransactionCategories(transactionList);
  console.log(categoryList);

  return (
      <aside className="right-sidebar">
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
              <h1 className="text-24 font-semibold text-gray-900">{`${user.name}`}</h1>
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
                  <BankCard userName={user.name} account={bankList[0]} showBalance={false}/>
                </div>
                {bankList[1] && (
                    <div className="absolute right-0 top-8 z-0 w-[90%]">
                      <BankCard userName={user.name} account={bankList[1]} showBalance={false}/>
                    </div>
                )}
              </div>
          )}

          {/*  budget list  */}
          <div className="mt-10 flex flex-col flex-1 gap-6">
            <h2 className="text-[18px] leading-[22px] text-gray-900 font-semibold">Top categories</h2>
            <div className="space-y-5">
              {Array.isArray(categoryList) && categoryList.length > 0 && categoryList.map((category) => (
                  <Category key={category.name} category={category}/>
              ))}
            </div>
          </div>
        </div>
      </aside>
  );
};

export default RightSideBar;
