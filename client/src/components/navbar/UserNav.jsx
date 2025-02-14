// UserNav.jsx

import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import LogoutIcon from "../../assets/icon/logOutIcon.png";
import AccountCircleIcon from "../../assets/icon/accountCircleIcon.png";

const UserNav = () => {
  const { user, signout } = useAuthContext();
  const signOutFunc = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/signout");
      toast.success("Sign out successfull");
      signout();
    } catch (error) {
      console.log();
      toast.error("Error signing out");
    }
  };

  return (
    <div className="absolute right-2 z-50 mt-[65px]">
      <div className="bg-white absolute right-0 rounded-b-md shadow-md border border-grey w-52 overflow-hidden duration-200">
        <div className="text-left py-2 pl-8">
          <span className="text-md font-bold text-dark-grey">
            @{user.userName}
          </span>
        </div>
        <Link
          to={`/user/${user.userName}`}
          className="flex gap-2 link pl-8 py-2 hover:bg-gray-100 "
        >
          {/* <img
            src={AccountCircleIcon}
            alt="profile"
            className="w-5 h-5 opacity-90"
          /> */}
          <p>Profile</p>
        </Link>
        <button
          className="flex gap-2 link pl-8 py-2 w-full items-center hover:bg-gray-100"
          onClick={signOutFunc}
        >
          {/* <img src={LogoutIcon} alt="logout" className="w-5 h-5 opacity-90" /> */}
          <p>Sign out</p>
        </button>
      </div>
    </div>
  );
};

export default UserNav;
