import React from 'react';

type RightSideBarProps = {
  user: User;
  transactionList: Array<Transaction>;
  bankList: Array<Bank>;
}

const RightSideBar = ({user, transactionList, bankList}: RightSideBarProps) => {
  return (
      <aside className="w-[355px] h-screen max-h-screen flex-col border-l border-gray-200 no-scrollbar xl:flex xl:overflow-y-scroll">

      </aside>
  );
};

export default RightSideBar;
