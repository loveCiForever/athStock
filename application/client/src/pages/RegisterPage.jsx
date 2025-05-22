// SignUpPage.jsx

import React, { useState, useEffect } from "react";

import LoginPicture from "../assets/images/loginPicture.jpg";
import RegisterForm from "../components/layout/form/RegisterForm.jsx";

const RegisterPage = () => {
  useEffect(() => {
    document.title = "Register new account";
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="flex flex-row items-center bg-white shadow-xl rounded-2xl sm:w-[65%] overflow-hidden">
        <div className="hidden lg:block w-full">
          <img src={LoginPicture} alt="Login" className="h-full" />
        </div>

        <div className="w-full py-8 px-10 sm:px-0 bg-red-200//">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
