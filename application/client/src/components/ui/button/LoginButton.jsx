import { useNavigate } from "react-router-dom";

const LoginButton = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`login-btn text-lg py-1 px-4 font-bold rounded-md ${
        theme === "dark-theme"
          ? "bg-white text-black hover:bg-gray-100 hover:text-black/50"
          : "bg-black text-white hover:bg-black/70"
      } `}
      onClick={() => {
        navigate("/login");
      }}
    >
      Login
    </button>
  );
};

export default LoginButton;
