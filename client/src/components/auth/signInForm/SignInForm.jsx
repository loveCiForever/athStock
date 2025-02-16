// SignInFrom.jsx

import googleLogo from "../../../assets/logo/googleLogo.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/AuthContext";
import { authWithGoogle } from "../firebase";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { configUser } = useAuthContext();
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/auth/signin", {
        email,
        password,
      })
      .then((result) => {
        // console.log("Sign in successfully");
        // console.log(result.data.data.user);
        toast.success("Sign in successfully");
        configUser(result.data.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data.error.message);
        toast.error(error.response.data.error.message);
      });
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const user = await authWithGoogle();
      if (!user) {
        toast.error("No user returned from GG sign-in");
        return;
      }
      const oauthData = {
        fullName: user.displayName,
        email: user.email,
        profile_img: user.photoURL,
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/auth/oauth",
        oauthData
      );
      configUser(data);
      toast.success(`Google sign-in successfull`);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(JSON.parse(error.request.response).message);
      console.log(error);
    }
  };

  return (
    <div className="w-full shadow-xs min-w-[96px]">
      <h1 className="font-bold text-[30px]">athStock</h1>
      <h2 className="tracking-wider text-[14px] text-placeholder-text-color">
        To continue, sign in to your account.
      </h2>
      <div className="mt-[20px]">
        <form className="flex flex-col" onSubmit={handleSignIn}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full tracking-wide bg-gray-100 py-[10px] pl-[20px] text-[13px] rounded-[10px] font-400 min-w-[300px] placeholder-gray-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-[10px]">
            <input
              type="password"
              placeholder="Password"
              className="w-full tracking-wide bg-gray-100 py-[10px] pl-[20px] text-[13px] rounded-[10px] font-400 min-w-[300px] placeholder-gray-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-5 py-[10px] rounded-xl bg-black text-[15px] text-white font-semibold tracking-wider hover:bg-gray-500 active:scale-[.98] active:duration-75 transition-all"
          >
            Sign In
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
          <h1 className="ml-[10px] text-[13px] font-normal">
            Sign in with Google
          </h1>
        </button>

        <div className="flex items-center content-center justify-center mt-[10px]">
          <div className="tracking-wider text-[12px] font-normal">
            Don't have an account?
          </div>
          <button
            onClick={() => {
              navigate("/register");
              // console.log("Sign in button clicked, navigate to RegisterPage");
            }}
            className="ml-[3px] font-semibold text-[12px] text-black hover:text-black hover:underline active:scale-[.98] active:duration-75 transition-all tracking-wider"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
