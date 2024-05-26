import React from 'react';
import Link from "next/link";
import {formatAmount} from "@/lib/utils";
import Image from "next/image";
import Copy from "@/components/customized/Copy";

type BankCardProps = {
  account: Account;
  userName: string;
  showBalance: boolean;
}

const BankCard = ({account, userName, showBalance}: BankCardProps) => {
  return (
      <div className="flex flex-col">
        <Link href={`/transaction-history/?id=${account.appwriteItemId}`}
              className="relative w-full min-w-[320px] h-[190px] flex justify-between rounded-[20px] border border-white bg-bank-gradient
                         shadow-creditCard backdrop-blur-[6px]">
          <div className="relative z-10 size-full max-w-[228px] pl-5 pr-1 pb-4 pt-5 flex flex-col justify-between rounded-l-[20px]
                          bg-gray-700 bg-bank-gradient">
            <div>
              <h1 className="text-[16px] leading-[24px] font-semibold text-white">{account.name || userName}</h1>
              <p className="font-ibm-plex-serif font-black text-white">{formatAmount(account.currentBalance)}</p>
            </div>

            <article className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-[12px] leading-[16px] font-semibold text-white">{userName}</h1>
                <h2 className="text-[12px] leading-[16px] font-semibold text-white">●● / ●●</h2>
              </div>
              <p className="text-[16px] text-white leading-[24px] font-semibold tracking-[1.1px]">
                ●●●● ●●●● ●●●● <span className="text-[16px] leading-[24px]">{account?.mask}</span>
              </p>
            </article>
          </div>

          {/*  bank card icon  */}
          <div className="size-full py-5 pr-5 flex flex-1 flex-col items-end justify-between rounded-r-[20px] bg-bank-gradient bg-cover
                          bg-center bg-no-repeat">
            <Image src="/icons/Paypass.svg" alt="Paypass" width={20} height={24}/>
            <Image src="/icons/mastercard.svg" alt="mastercard" width={45} height={32} className="ml-5"/>
            <Image src="/icons/lines.svg" alt="Lines" width={316} height={190} className="absolute top-0 left-0"/>
          </div>
        </Link>
        {showBalance && <Copy title={account?.shareableId}/>}
      </div>
  );
};

export default BankCard;
