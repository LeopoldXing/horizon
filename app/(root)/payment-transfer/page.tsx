import React from 'react';
import {getAccountList} from "@/lib/actions/bank.actions";
import HeaderBar from "@/components/customized/layout/HeaderBar";
import PaymentTransferForm from "@/components/customized/form/PaymentTransferForm";

const TransactionHistoryPage = async () => {
  const accountList = await getAccountList();

  if (!accountList) return;

  return (
      <section className="p-8 flex flex-col bg-gray-25 no-scrollbar overflow-y-scroll md:max-h-screen xl:py-12">
        <HeaderBar title="Payment Transfer" subText="Please provide any specific details or notes related to the payment transfer"/>

        <section className="size-full pt-5">
          <PaymentTransferForm accountList={accountList}/>
        </section>
      </section>
  )
};

export default TransactionHistoryPage;
