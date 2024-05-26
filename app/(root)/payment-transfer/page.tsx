import React from 'react';
import {getAccounts} from "@/lib/actions/bank.actions";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import HeaderBar from "@/components/customized/layout/HeaderBar";
import PaymentTransferForm from "@/components/customized/form/PaymentTransferForm";

const TransactionHistoryPage = async () => {
  const loggedInUser = await getLoggedInUser();
  const accountList = await getAccounts(loggedInUser.$id)

  if (!accountList) return;

  const accountsData = accountList?.data;

  return (
      <section className="p-8 flex flex-col bg-gray-25 no-scrollbar overflow-y-scroll md:max-h-screen xl:py-12">
        <HeaderBar title="Payment Transfer" subText="Please provide any specific details or notes related to the payment transfer"/>

        <section className="size-full pt-5">
          <PaymentTransferForm accountList={accountsData}/>
        </section>
      </section>
  )
};

export default TransactionHistoryPage;
