import React from 'react';
import Link from "next/link";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BankTabItem} from "@/components/customized/BankTabItem";
import BankInfo from "@/components/customized/BankInfo";
import TransactionTable from "@/components/customized/TransactionTable";

declare type RecentTransactionsProps = {
  accountList: Array<Account>;
  transactionList: Array<Transaction>;
  appwriteItemId: string;
  currentPage: number;
}
const RecentTransactions = ({accountList, transactionList, appwriteItemId, currentPage}: RecentTransactionsProps) => {
  return (
      <section className="w-full flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h2 className="text-20 md:text-24 text-gray-900 font-semibold">Recent transactions</h2>
          <Link href={`/transaction-history/?id=${appwriteItemId}`}
                className="px-4 py-2.5 text-14 text-gray-700 font-semibold border border-gray-300 rounded-lg">
            View all
          </Link>
        </header>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full mb-8 flex flex-nowrap custom-scrollbar">
            {accountList.map((account: Account) => (
                <TabsTrigger key={account.id} value={account.appwriteItemId}>
                  <BankTabItem account={account} key={account.id} appwriteItemId={account.appwriteItemId}/>
                </TabsTrigger>
            ))}
          </TabsList>
          {accountList.map((account: Account) => (
              <TabsContent value={account.appwriteItemId} key={account.id} className="space-y-4">
                <BankInfo account={account} type="full" appwriteItemId={appwriteItemId}/>
                <TransactionTable transactionList={transactionList}/>
              </TabsContent>
          ))}
        </Tabs>

      </section>
  );
};

export default RecentTransactions;
