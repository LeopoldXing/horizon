import React from 'react';
import HeaderBar from "@/components/customized/layout/HeaderBar";
import RightSideBar from "@/components/customized/layout/RightSideBar";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {getAccountList, getUserBankQuantity, getUserCurrentBalance} from "@/lib/actions/bank.actions";
import TotalBalanceBox from "@/components/customized/TotalBalanceBox";
import RecentTransactions from "@/components/customized/RecentTransactions";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const RootPage = async ({searchParams: {id, page}}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  // get user
  const loggedInUser = await getLoggedInUser();

  // get accounts
  const accountList = await getAccountList();
  if (!accountList || !Array.isArray(accountList) || accountList.length == 0) return;
  const transactionList = accountList[0].transactionList;

  // get current accountId
  const currentAccountId = id ? id : accountList[0].id;

  // get total bank number
  const totalBankNumber = await getUserBankQuantity();

  // get total current balance
  const totalCurrentBalance = await getUserCurrentBalance();

  return (
      /*  home  */
      <div className="w-full flex flex-row no-scrollbar max-xl:max-h-screen max-xl:overflow-y-scroll">
        {/*  home content  */}
        <div className="px-5 sm:px-8 py-7 lg:py-12 w-full flex flex-col flex-1 gap-8 no-scrollbar xl:max-h-screen xl:overflow-y-scroll">
          {/*  home header  */}
          <div className="flex flex-col justify-between gap-8">
            <HeaderBar type="greeting" title="Welcome" user={loggedInUser || "guest"}
                       subText="Access and manage your accounts and transactions efficiently"/>
            <TotalBalanceBox accounts={accountList} totalBanks={totalBankNumber}
                             totalCurrentBalance={totalCurrentBalance}/>
          </div>

          <RecentTransactions accountList={accountList} currentPage={currentPage}
                              currentAccountId={currentAccountId}/>
        </div>

        <RightSideBar user={loggedInUser} bankList={accountList?.slice(0, 2)} transactionList={transactionList}/>
      </div>
  );
};

export default RootPage;
