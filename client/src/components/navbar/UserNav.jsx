// UserNav.jsx

import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import LogoutIcon from "../../assets/icon/logOutIcon.png";
import AccountCircleIcon from "../../assets/icon/accountCircleIcon.png";
import LanguageIcon from "../../assets/icon/languageIcon.png";
import DarkModeIcon from "../../assets/icon/darkModeIcon.png";
import LightModeIcon from "../../assets/icon/lightModeIcon.png";

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
    <div className="absolute right-2 z-50 mt-12">
      <div className="bg-white absolute right-0 rounded-xl shadow-md border border-grey w-60 overflow-hidden duration-200">
        <div className="flex flex-col text-left py-3 pl-8 bg-green-00">
          <span className="text-md font-bold text-dark-grey mb-[5px]">
            {/* @{user.fullName} */}
            Nguyen Quang Huy
          </span>
          <span className="text-md font-medium text-dark-grey">
            @{user.userName}
          </span>
        </div>

        <div className="w-full font-[00]">
          <div className="w-full border-[1px] border-gray-200"></div>

          <div className="bg-red-00">
            <Link
              to={`/user/${user.userName}`}
              className="flex gap-2 link pl-8 py-2 hover:bg-gray-100 bg-red-200/"
            >
              <img
                src={AccountCircleIcon}
                alt="profile"
                className="w-5 h-5 opacity-100"
              />
              <p className="bg-green-200//">Profile</p>
            </Link>
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

          <div className="w-full border-[1px] border-gray-200"></div>

          <div className="bg-blue-00">
            <button
              className="flex gap-2 link pl-8 w-full py-2 items-center hover:bg-gray-100 bg-red-200/"
              onClick={null}
            >
              <img
                src={LanguageIcon}
                alt="laguage switcher"
                className="w-5 h-5 opacity-100"
              />
              <p>Switch to Vietnamese</p>
            </button>

            <button
              className="flex gap-2 link pl-8 py-2 w-full items-center hover:bg-gray-100 bg-green-200/"
              onClick={null}
            >
              <img
                src={LightModeIcon}
                alt="theme switcher"
                className="w-5 h-5 opacity-100"
              />
              <p>Switch to Dark mode</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNav;
