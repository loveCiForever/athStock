import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthFormInput from "../../ui/input/AuthFormInput";

import { toast } from "react-toastify";
import axios from "axios";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../../../utils/config.jsx";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, configUser } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      const response = await axios.post(
        `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      console.log(response);
      toast.success("Login successful");
      configUser(response.data.data.user, response.data.data.access_token);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto px-2 sm:px-10 bg-green-200//">
      <h1 className="font-bold text-2xl lg:text-4xl">athStock</h1>
      <h2 className="tracking-wide text-sm text-gray-500">
        Login to your account to continue
      </h2>

      <div className="mt-6">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 mb-4">
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

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-gray-600 hover:text-black hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            onClick={handleLogin}
            className={`py-3 rounded-lg bg-black text-sm text-white font-semibold tracking-wide
              hover:bg-black/70 active:scale-[.98] active:duration-75 transition-all
              ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Login..." : "Login"}
          </button>
        </div>

        <div className="flex items-center justify-center mt-6">
          <p className="text-xs text-gray-600">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            disabled={isLoading}
            className="ml-1 text-xs font-semibold text-black hover:underline active:scale-[.98] active:duration-75 transition-all"
          >
            Register one
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
