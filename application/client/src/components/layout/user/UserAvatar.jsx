// ./applications/client/src/components/layout/user/UserAvatar.jsx

import { useState } from "react";

import DefaultAvatar from "../../../assets/logos/facebookLogo.svg";
import UserPanel from "./UserPanel";

const UserAvatar = ({ user }) => {
  const [toggleUserPanel, setToggleUserPanel] = useState(false);

  return (
    <>
      <button
        className={`user-avatar border-3 border-gray-400 rounded-full ${
          toggleUserPanel && "border-orange-400"
        }`}
        onClick={() => {
          setToggleUserPanel(!toggleUserPanel);
        }}
      >
        <img
          src={user.profile_img ? user.profile_img : DefaultAvatar}
          alt=""
          className="w-10 rounded-full p-1"
        />
      </button>
      {toggleUserPanel && <UserPanel user={user} />}
    </>
  );
};

export default UserAvatar;
