import React from 'react';
import HeaderBar from "@/components/customized/layout/HeaderBar";
import RightSideBar from "@/components/customized/layout/RightSideBar";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {getAccount, getAccounts} from "@/lib/actions/bank.actions";
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
  const accountListData = await getAccounts(loggedInUser.$id);
  if (!accountListData) return;
  const accountList = accountListData.data;
  const appwriteItemId = (id as string) || (accountList[0]?.appwriteItemId);
  const account = await getAccount(appwriteItemId);

  return (
      /*  home  */
      <div className="w-full flex flex-row no-scrollbar max-xl:max-h-screen max-xl:overflow-y-scroll">
        {/*  home content  */}
        <div className="px-5 sm:px-8 py-7 lg:py-12 w-full flex flex-col flex-1 gap-8 no-scrollbar xl:max-h-screen xl:overflow-y-scroll">
          {/*  home header  */}
          <div className="flex flex-col justify-between gap-8">
            <HeaderBar type="greeting" title="Welcome" user={loggedInUser || "guest"}
                       subText="Access and manage your accounts and transactions efficiently"/>
            <TotalBalanceBox accounts={accountList} totalBanks={accountListData.totalBanks}
                             totalCurrentBalance={accountListData.totalCurrentBalance}/>
          </div>

          <RecentTransactions accountList={accountList} transactionList={account.transactionList} appwriteItemId={appwriteItemId}
                              currentPage={currentPage}/>
        </div>

        <RightSideBar user={loggedInUser} bankList={accountList?.slice(0, 2)} transactionList={account.transactionList}/>
      </div>
  );
};

export default RootPage;
