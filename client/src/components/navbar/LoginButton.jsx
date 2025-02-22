import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="flex items-center justify-center active:scale-[.90] active:duration-75 transition-all 
      shadow-xs rounded-full px-4 py-1 hover:bg-gray-200 hover:border-white"
      onClick={() => {
        navigate("/login");
      }}
    >
      <p className="font-semibold text-sm lg:text-base tracking-wider">Login</p>
    </button>
  );
};

export default LoginButton;
