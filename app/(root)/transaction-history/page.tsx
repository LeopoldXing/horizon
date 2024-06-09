import React from 'react';
import HeaderBar from "@/components/customized/layout/HeaderBar";
import {getAccountList} from "@/lib/actions/bank.actions";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import TransactionTable from "@/components/customized/TransactionTable";
import {formatAmount} from "@/lib/utils";
import {Pagination} from "@/components/customized/Pagination";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
const TransactionHistoryPage = async ({searchParams: {id, page}}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedInUser = await getLoggedInUser();
  const accounts = await getAccountList();
  if (!accounts || !loggedInUser) return;

  const currentAccount = accounts[0];

  const rowsPerPage = 10;
  const totalPages = Math.ceil(currentAccount?.transactionList.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = currentAccount?.transactionList.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
      <div className="w-full max-h-screen p-8 flex flex-col gap-8 bg-gray-25 overflow-y-scroll xl:py-12">
        <div className="w-full flex flex-col gap-8 items-start justify-between md:flex-row">
          <HeaderBar title="Transaction History" subText="See your bank details and transactions."/>
        </div>

        <div className="space-y-6">
          <div className="px-4 py-5 flex flex-col justify-between gap-4 border-y rounded-lg bg-blue-600 md:flex-row">
            <div className="flex flex-col gap-2">
              <h2 className="text-18 font-bold text-white">{currentAccount.name}</h2>
              <p className="text-14 text-blue-25">
                {currentAccount.officialName}
              </p>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                ●●●● ●●●● ●●●● {currentAccount.mask}
              </p>
            </div>

            <div className="px-4 py-2 flex flex-col justify-center items-center gap-2 rounded-md text-white bg-blue-25/20">
              <p className="text-14">Current balance</p>
              <p className="text-24 text-center font-bold">{formatAmount(currentAccount.currentBalance)}</p>
            </div>
          </div>

          <section className="flex w-full flex-col gap-6">
            <TransactionTable transactionList={currentTransactions}/>
            {totalPages > 1 && (
                <div className="my-4 w-full">
                  <Pagination totalPages={totalPages} page={currentPage}/>
                </div>
            )}
          </section>
        </div>
      </div>
  );
};

export default TransactionHistoryPage;
