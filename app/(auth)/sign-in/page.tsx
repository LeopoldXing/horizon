import React from 'react';
import AuthForm from "@/components/customered/form/AuthForm";

const SignInPage = () => {
  return (
      <div className="size-full flex justify-center items-center max-sm:px-6">
        <AuthForm type="sign-in"/>
      </div>
  );
};

export default SignInPage;
