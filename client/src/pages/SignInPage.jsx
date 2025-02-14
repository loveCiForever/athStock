// SignInPage.jsx

import React, { useState, useEffect } from "react";

import LoginPicture from "../assets/picture/loginPicture.jpg";
import SignInForm from "../components/auth/signInForm/SignInForm.jsx";

const SignInPage = () => {
  useEffect(() => {
    document.title = "Sign In";
  }, []);

  return (
    // Fixed size for extra large
    <div className="flex items-center justify-center w-full h-screen bg-gray-100 min-w-960">
      <div className="flex items-center justify-center w-auto bg-white shadow-2xl rounded-3xl">
        <img
          src={LoginPicture}
          alt="Login Picture"
          className={`max-w-[480px] rounded-l-xl mr-10`}
        />
        <SignInForm />
        <div className="mr-10"></div>
      </div>
    </div>
  );
};

export default SignInPage;
