"use client";

import Image from "next/image";
import {useSearchParams, useRouter} from "next/navigation";
import {cn, formUrlQuery, formatAmount} from "@/lib/utils";

declare type BankInfoProps = {
  account: Account;
  appwriteItemId?: string;
  type: "full" | "card";
}
const BankInfo = ({account, appwriteItemId, type}: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, {scroll: false});
  };

  const getAccountTypeColors = (type: AccountTypes) => {
    switch (type) {
      case "depository":
        return {
          bg: "bg-blue-25",
          lightBg: "bg-blue-100",
          title: "text-blue-900",
          subText: "text-blue-700",
        };

      case "credit":
        return {
          bg: "bg-success-25",
          lightBg: "bg-success-100",
          title: "text-success-900",
          subText: "text-success-700",
        };

      default:
        return {
          bg: "bg-green-25",
          lightBg: "bg-green-100",
          title: "text-green-900",
          subText: "text-green-700",
        };
    }
  }
  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
      <div onClick={handleBankChange}
           className={cn(`p-4 flex gap-[18px] border border-transparent bg-blue-25 transition-all ${colors.bg}`, {
             "shadow-sm border-blue-700": type === "card" && isActive,
             "rounded-xl": type === "card",
             "hover:shadow-sm cursor-pointer": type === "card"
           })}>
        <figure className={`flex justify-center items-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}>
          <Image src="/icons/connect-bank.svg" width={20} height={20} alt={account.subtype} className="m-2 min-w-5"/>
        </figure>
        <div className="flex w-full flex-1 flex-col justify-center gap-1">
          <div className="flex items-center justify-between flex-1 gap-2 overflow-hidden">
            <h2 className={`text-16 line-clamp-1 flex-1 font-bold text-blue-900 ${colors.title}`}>
              {account.name}
            </h2>
            {type === "full" && (
                <p className={`text-12 rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}>
                  {account.subtype}
                </p>
            )}
          </div>

          <p className={`text-16 font-medium text-blue-700 ${colors.subText}`}>
            {formatAmount(account.currentBalance)}
          </p>
        </div>
      </div>
  );
};

export default BankInfo;
