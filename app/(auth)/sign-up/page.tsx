import React from 'react';
import AuthForm from "@/components/customized/form/AuthForm";

const SignUpPage = async () => {
  return (
      <div className="size-full flex justify-center items-center max-sm:px-6">
        <AuthForm type="sign-up"/>
      </div>
  );
};

export default SignUpPage;
