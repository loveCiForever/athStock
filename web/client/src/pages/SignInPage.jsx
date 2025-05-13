// SignInPage.jsx

import React, { useState, useEffect } from "react";

import LoginPicture from "../assets/images/loginPicture.jpg";
import SignInForm from "../components/layout/auth-form/SignInForm.jsx";

const SignInPage = () => {
  useEffect(() => {
    document.title = "Sign In";
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="flex flex-row items-center bg-white shadow-xl rounded-2xl sm:w-[65%] overflow-hidden">
        <div className="hidden lg:block w-full">
          <img src={LoginPicture} alt="Login" className="w-full h-full" />
        </div>

        <div className="w-full py-8 px-10 sm:px-0 bg-red-200//">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
