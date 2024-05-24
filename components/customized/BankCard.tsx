import React from 'react';
import Link from "next/link";
import {formatAmount} from "@/lib/utils";
import Image from "next/image";

type BankCardProps = {
  key: string;
  account: Account;
  userName: string;
  showBalance: boolean;
}

const BankCard = ({key, account, userName, showBalance}: BankCardProps) => {
  return (
      <div className="flex flex-col">
        <Link href="/" className="relative w-full max-w-[320px] h-[190px] flex justify-between rounded-[20px] border border-white
                       bg-bank-gradient shadow-creditCard backdrop-blur-[6px]">
          <div className="relative z-10 max-w-[228px] px-5 pb-4 pt-5 size-full flex flex-col justify-between rounded-l-[20px]
                          bg-gray-700 bg-bank-gradient">
            <div>
              <h1 className="text-16 font-semibold text-white">{account.name || userName}</h1>
              <p className="font-ibm-plex-serif font-black text-white">{formatAmount(account.currentBalance)}</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-12 font-semibold text-white">{userName}</h1>
                <h2 className="text-12 font-semibold text-white">&#9679;&#9679; / &#9679;&#9679;</h2>
              </div>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679;
                <span className="text-16">${account.mask}</span>
              </p>
            </div>
          </div>

          {/*  bank card icon  */}
          <div className="size-full py-5 pr-5 flex flex-1 flex-col items-end justify-between rounded-r-[20px] bg-bank-gradient bg-cover
                          bg-center bg-no-repeat">
            <Image src="/icons/Paypass.svg" alt="Paypass" width={20} height={24}/>
            <Image src="/icons/mastercard.svg" alt="mastercard" width={45} height={32} className="ml-5"/>
            <Image src="/icons/lines.svg" alt="Lines" width={316} height={190} className="absolute top-0 left-0"/>
          </div>
        </Link>
      </div>
  );
};

export default BankCard;
