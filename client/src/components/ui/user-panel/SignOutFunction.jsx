import { toast } from "react-toastify";
import axios from "axios";
import { useAuthContext } from "../../hooks-services/AuthContext.jsx";

export const SignOutFunction = async () => {
  const { user, signout } = useAuthContext();
  try {
    await axios.post("http://localhost:8000/api/auth/signout");
    toast.success("Sign out successful");
    console.log("Sign out successful");
    signout();
  } catch (error) {
    console.log(error);
    toast.error("Error signing out");
  }
};
