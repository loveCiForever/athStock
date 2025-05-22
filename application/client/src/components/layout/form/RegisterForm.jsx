import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthFormInput from "../../ui/input/AuthFormInput";

import { toast } from "react-toastify";

import axios from "axios";
// import { useAuthContext } from "../../../hooks/useAuthContext.jsx";

const RegisterForm = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const VITE_BASE_URL = import.meta.env.VITE_LOCAL_BLOG_API_SERVER;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullname) {
      toast.error("Please fill in your full name");
      return;
    }

    if (!email) {
      toast.error("Please fill in your email address");
      return;
    }

    if (!password) {
      toast.error("Please fill in your password");
      return;
    }

    setIsLoading(true);
    try {
      // console.log(VITE_BASE_URL);
      const response = await axios.post(`${VITE_BASE_URL}/api/auth/register`, {
        full_name: fullname,
        email,
        password,
      });
      // console.log(response);

      toast.success(
        "Registration successful. Check your email to verify account"
      );
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto px-2 sm:px-10 bg-green-200//">
      <h1 className="font-bold text-2xl lg:text-3xl">athStock</h1>
      <h2 className="tracking-wide text-sm text-gray-500">
        Register new account to continue
      </h2>

      <div className="mt-6">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 mb-4">
            <AuthFormInput
              type="text"
              placeholder="Full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              disabled={isLoading}
            />

            <AuthFormInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <AuthFormInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            disabled={isLoading}
            onClick={handleRegister}
            className={`py-3 rounded-lg bg-black text-sm text-white font-semibold tracking-wide
              hover:bg-black/70 active:scale-[.98] active:duration-75 transition-all
              ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>

        <div className="flex items-center justify-center mt-6">
          <p className="text-sm text-gray-600">Already registered before ?</p>
          <button
            onClick={() => navigate("/login")}
            disabled={isLoading}
            className="ml-1 text-sm font-semibold text-black hover:underline active:scale-[.98] active:duration-75 transition-all"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
