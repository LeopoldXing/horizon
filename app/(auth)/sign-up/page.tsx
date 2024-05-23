import React from 'react';
import AuthForm from "@/components/customered/form/AuthForm";

const SignUpPage = async () => {
  return (
      <div className="size-full flex justify-center items-center max-sm:px-6">
        <AuthForm type="sign-up"/>
      </div>
  );
};

export default SignUpPage;
