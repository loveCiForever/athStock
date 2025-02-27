// .client/src/components/navbar/LoginButton.jsx

import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="flex items-center justify-center active:scale-[.90] active:duration-75 transition-all shadow-xs rounded-full px-2 lg:px-4 py-2 lg:hover:bg-gray-200 "
      onClick={() => {
        navigate("/login");
      }}
    >
      <p className="font-semibold text-sm lg:text-base tracking-wider">Login</p>
    </button>
  );
};

export default LoginButton;
