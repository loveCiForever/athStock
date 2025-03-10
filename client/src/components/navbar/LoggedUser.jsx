// ./client/src/components/navbar/LoggedUser.jsx

import UserNav from "./UserNav";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

const LoggedUser = ({ theme }) => {
  const [toggleLinks, setToggleLinks] = useState(false);
  const { user } = useAuthContext();

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="btn-user-nav "
        onClick={() => setToggleLinks((prev) => !prev)}
      >
        <img
          src={user.profile_img}
          alt="profile image"
          className="user-profile-img w-8 h-8 lg:w-10 lg:h-10 rounded-full"
        />
      </button>
      {toggleLinks && <UserNav theme={theme} />}
    </div>
  );
};

export default LoggedUser;
