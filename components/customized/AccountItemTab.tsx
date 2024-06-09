"use client";

import {useSearchParams, useRouter} from "next/navigation";

import {cn, formUrlQuery} from "@/lib/utils";

declare type BankTabItemProps = {
  account: Account;
  currentAccountId: string;
}
export const AccountItemTab = ({account, currentAccountId}: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = account.id == currentAccountId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({params: searchParams.toString(), key: "id", value: account?.id});
    router.push(newUrl, {scroll: false});
  };

  return (
      <div onClick={handleBankChange} className={cn(`banktab-item`, {" border-blue-600": isActive})}>
        <p className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {" text-blue-600": isActive})}>
          {account.name}
        </p>
      </div>
  );
};
