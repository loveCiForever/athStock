// .client/src/components/navbar/UserNav.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import LogoutIcon from "../../assets/icon/logOutIcon.png";
import AccountCircleIcon from "../../assets/icon/accountCircleIcon.png";
import LanguageIcon from "../../assets/icon/languageIcon.png";
import DarkModeIcon from "../../assets/icon/darkModeIcon.png";
import LightModeIcon from "../../assets/icon/lightModeIcon.png";
import ChangeThemeButton from "./ChangeThemeButton.jsx";
import { useEffect } from "react";

const UserNav = () => {
  const { user, signout } = useAuthContext();
  const navigate = useNavigate();

  const signOutFunc = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/signout");
      toast.success("Sign out successful");
      signout();
    } catch (error) {
      console.log();
      toast.error("Error signing out");
    }
  };

  const formatFullName = (fullName) => {
    if (!fullName) {
      return "Did not update Fullname";
    }

    return fullName
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // useEffect(() => {
  //   console.log(user);
  // });

  return (
    <div className="absolute right-2 z-50 mt-12">
      <div className="flex flex-col items-center justify-center bg-white absolute right-0 rounded-xl shadow-md border border-grey w-60 overflow-hidden duration-200">
        <Link
          className="flex flex-col w-full text-left py-3 pl-8 bg-green-00"
          to={`/user/${user.username}`}
        >
          <span className="text-md font-bold text-dark-grey mb-[5px]">
            {formatFullName(user.fullName)}
          </span>
          <span className="text-md font-medium text-dark-grey">
            @{user.userName}
          </span>
        </Link>

        <div className="w-full bg-red-00 border-t-[1px]">
          <button
            className="flex gap-2 link pl-8 py-2 w-full items-center hover:bg-gray-100 bg-green-200/"
            onClick={signOutFunc}
          >
            <img
              src={LogoutIcon}
              alt="logout"
              className="w-5 h-5 opacity-100"
            />
            <p>Sign out</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNav;
