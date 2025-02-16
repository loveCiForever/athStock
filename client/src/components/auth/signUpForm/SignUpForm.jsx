import axios from "axios";
import googleLogo from "../../../assets/logo/googleLogo.svg";

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authWithGoogle } from "../firebase";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Register button clicked");

    console.log("Fullname:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);

    axios
      .post("http://localhost:8000/api/auth/signup", {
        fullName,
        email,
        password,
      })
      .then((result) => {
        console.log(result);
        toast.success("Registration successful!");
        navigate("/");
      })
      .catch((error) => {
        // if (error.response) {
        //   // The request was made and the server responded with a status code
        //   console.error("Error response data:", error.response.data);
        //   console.error("Error response status:", error.response.status);
        //   console.error("Error response headers:", error.response.headers);
        //   toast.error(
        //     `Registration failed: ${
        //       error.response.data.message || "Please try again."
        //     }`
        //   );
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.error("Error request:", error.request);
        //   toast.error("No response from server. Please try again.");
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   console.error("Error message:", error.message);
        //   toast.error("An error occurred. Please try again.");
        // }

        // console.log(error);
        console.log(error.response.data.error.message);
        toast.error(error.response.data.error.message);
      });
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user } = await authWithGoogle();
      if (!user) return;
      const oauthData = {
        fullName: user.displayName,
        email: user.email,
        profile_img: user.photoURL,
      };

      const { data } = await axios.post("/api/auth/oauth", oauthData);
      configUser(data);
      toast.success(`${type.replace("-", " ")} successfull`);
      navigate("/", { replace: true });
    } catch (error) {
      // toast.error(JSON.parse(error.request.response).message);
    }
  };

  useEffect(() => {
    console.log(import.meta.env);
  }, []);

  return (
    <div className="w-[300px] shadow-xs">
      <h1 className="font-bold text-[30px]">athStock</h1>
      <h2 className="tracking-wider text-[14px] text-placeholder-text-color">
        To continue, sign up for an account
      </h2>
      <div className="flex flex-col mt-[20px] w-full">
        <form className="flex flex-col" onSubmit={handleSignUp}>
          <div className="">
            <input
              type="text"
              placeholder="Full name"
              className="w-full tracking-wide bg-gray-100 py-[10px] pl-[20px] text-[13px] rounded-[10px] font-400 placeholder-gray-500"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mt-[10px]">
            <input
              type="email"
              placeholder="Email"
              className="w-full tracking-wide bg-gray-100 py-[10px] pl-[20px] text-[13px] rounded-[10px] font-400 placeholder-gray-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-[10px]">
            <input
              type="password"
              placeholder="Password"
              className="w-full tracking-wide bg-gray-100 py-[10px] pl-[20px] text-[13px] rounded-[10px] font-400 placeholder-gray-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-5 py-[10px] rounded-xl bg-black text-[15px] text-white font-semibold tracking-wider hover:bg-gray-500 active:scale-[.98] active:duration-75 transition-all"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center my-[20px]">
          <hr className="w-1/4 h-1/2 bg-placeholder-bg-color" />
          <h2 className="tracking-wider text-center font-normal text-[13px] mx-[20px] text-placeholder-text-color">
            Or sign in with
          </h2>
          <hr className="w-1/4 h-1/2 bg-placeholder-bg-color" />
        </div>

        <button
          className="w-full flex items-center justify-center py-3 rounded-xl bg-gray-100 text-black font-normal hover:bg-gray-200 active:scale-[.98] active:duration-75 transition-all tracking-wide"
          onClick={handleGoogleAuth}
        >
          <img src={googleLogo} className="w-5" />
          <h2 className="ml-[10px] text-[13px] font-normal">
            Sign in with Google
          </h2>
        </button>

        <div className="flex items-center content-center justify-center mt-[10px]">
          <div className="tracking-wider text-[12px] font-normal">
            Already have an account?
          </div>
          <button
            onClick={() => {
              navigate("/login");
              console.log(import.meta.env.VITE_FIREBASE_API_KEY);
            }}
            className="ml-[3px] font-semibold text-[12px] text-black hover:text-black hover:underline active:scale-[.98] active:duration-75 transition-all tracking-wider"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
