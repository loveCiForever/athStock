import RegisterForm from "../components/auth/signUpForm/SignUpForm";
import LoginPicture from "../assets/picture/loginPicture.jpg";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100 min-w-960">
      <div className="flex items-center justify-center w-auto bg-white shadow-2xl rounded-3xl">
        <img
          src={LoginPicture}
          alt="Login Picture"
          className={`max-w-[480px] rounded-l-xl mr-10`}
        />

        <RegisterForm />

        <div className="ml-10"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
