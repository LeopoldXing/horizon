import React from 'react';
import AnimatedCounter from "@/components/customized/AnimatedCounter";
import DoughnutChart from "@/components/customized/chart/DoughnutChart";

type TotalBalanceBoxProps = {
  accounts: Account[],
  totalBanks: number,
  totalCurrentBalance: number
}

const TotalBalanceBox = ({accounts = [], totalBanks, totalCurrentBalance}: TotalBalanceBoxProps) => {
  return (
      <div className="p-4 w-full flex items-center gap-4 rounded-xl border border-gray-200 shadow-chart sm:p-6 sm:gap-6">
        <div className="flex items-center size-full max-w-[100px] sm:max-w-[120px]">
          <DoughnutChart accounts={accounts}/>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-18 font-semibold text-gray-900">Bank Accounts: {totalBanks}</h2>
          <div className="flex flex-col gap-2">
            <p className="text-14 font-medium text-gray-600">Total Current Balance</p>
            <div className="flex justify-center items-center gap-2 text-24 lg:text-30 flex-1 font-semibold text-gray-900">
              <AnimatedCounter amount={totalCurrentBalance} prefix="$" decimal="," decimals={2} duration={1}/>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TotalBalanceBox;
