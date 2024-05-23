import React from 'react';
import HeaderBar from "@/components/customered/layout/HeaderBar";
import RightSideBar from "@/components/customered/layout/RightSideBar";
import {getLoggedInUser} from "@/lib/actions/user.actions";

const RootPage = async () => {
  const loggedInUser = await getLoggedInUser();
  let firstName = "";
  let lastName = "";
  if (loggedInUser) {
    let name = loggedInUser.name;
    firstName = name.split(" ")[0];
    lastName = name.split(" ")[1];
  }

  const loginInfo = {
    user: {...loggedInUser, firstName: firstName, lastName: lastName}
  }

  return (
      /*  home  */
      <div className="w-full flex flex-row no-scrollbar max-xl:max-h-screen max-xl:overflow-y-scroll">
        {/*  home content  */}
        <div className="px-5 sm:px-8 py-7 lg:py-12 w-full flex flex-col flex-1 gap-8 no-scrollbar xl:max-h-screen xl:overflow-y-scroll">
          {/*  home header  */}
          <div className="flex flex-col justify-between gap-8">
            <HeaderBar type="greeting" title="Welcome" user={loginInfo?.user || "guest"}
                       subText="Access and manage your accounts and transactions efficiently"/>
          </div>
        </div>

        <RightSideBar user={loginInfo.user} bankList={[]} transactionList={[]}/>
      </div>
  );
};

export default RootPage;
