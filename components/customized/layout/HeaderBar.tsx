import React from 'react';

type HeaderBarProps = {
  type?: "greeting" | "title";
  title: string;
  user?: User | "guest";
  subText?: string;
}

const HeaderBar = ({type = "title", title, user, subText}: HeaderBarProps) => {
  return (
      <div className="flex flex-col space-y-1">
        <h1 className="text-24 lg:text-30 font-semibold text-gray-900">
          {title}
          {type === "greeting" && (
              <span className="text-bankGradient">&nbsp;{user === "guest" ? "Guest" : user?.firstName}</span>
          )}
        </h1>
        <p className="text-14 lg:text-16 font-normal text-gray-600">{subText}</p>
      </div>
  );
};

export default HeaderBar;
