// SignUpPage.jsx

import React, { useState, useEffect } from "react";

import LoginPicture from "../assets/images/loginPicture.jpg";
import SignUpForm from "../components/layout/auth-form/SignUpForm.jsx";

const SignUpPage = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="flex flex-row items-center bg-white shadow-xl rounded-2xl sm:w-[65%] overflow-hidden">
        <div className="hidden lg:block w-full">
          <img
            src={LoginPicture}
            alt="Sign Up"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full py-8 px-10 sm:px-0 bg-red-200//">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
