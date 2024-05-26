import React from 'react';
import {getAccounts} from "@/lib/actions/bank.actions";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import HeaderBar from "@/components/customized/layout/HeaderBar";
import BankCard from "@/components/customized/BankCard";

const MyBanksPage = async () => {
  const loggedInUser = await getLoggedInUser();
  const accounts = await getAccounts(loggedInUser.$id)
  return (
      <section className='flex'>
        <div className="w-full max-h-screen h-screen p-8 flex flex-col bg-gray-25 xl:py-12">
          <HeaderBar title="My Bank Accounts" subText="Effortlessly manage your banking activites."/>

          <div className="space-y-4">
            <h2 className="text-18 font-semibold text-gray-900">
              Your cards
            </h2>
            <div className="flex flex-wrap gap-6">
              {Array.isArray(accounts?.data) && accounts.data.map((account: Account) => (
                  <div key={account.id}>
                  <BankCard account={account} userName={loggedInUser?.name} showBalance={true}/></div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
};

export default MyBanksPage;
