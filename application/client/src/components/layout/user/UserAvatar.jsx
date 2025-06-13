// ./applications/client/src/components/layout/user/UserAvatar.jsx

import { useState, useEffect, useRef } from "react";
import DefaultAvatar from "../../../assets/logos/facebookLogo.svg";
import UserPanel from "./UserPanel";

const UserAvatar = ({ user }) => {
  const [toggleUserPanel, setToggleUserPanel] = useState(false);
  const avatarRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setToggleUserPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={avatarRef} className="relative">
      <button
        className={`user-avatar border-3 border-gray-400 rounded-full 
          ${toggleUserPanel && "border-orange-400"}
          transition-all duration-200 hover:scale-105
        `}
        onClick={() => setToggleUserPanel(!toggleUserPanel)}
      >
        <img
          src={user.profile_img ? user.profile_img : DefaultAvatar}
          alt="User avatar"
          className="w-8 md:w-10 rounded-full p-1"
        />
      </button>
      {toggleUserPanel && <UserPanel user={user} />}
    </div>
  );
};

export default UserAvatar;
