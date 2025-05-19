// ./client/src/components/navbar/LoggedUser.jsx

import UserPanel from "./UserPanel.jsx";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";

const LoggedUser = ({ theme }) => {
  const [toggleLinks, setToggleLinks] = useState(false);
  const { user } = useAuthContext();

  // console.log(user);

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="btn-user-nav border-[2px] rounded-full"
        onClick={() => setToggleLinks((prev) => !prev)}
      >
        <img
          src={user.profile_img}
          alt="profile image"
          className="user-profile-img w-8 h-8 lg:w-10 lg:h-10 rounded-full"
        />
      </button>
      {toggleLinks && <UserPanel theme={theme} />}
    </div>
  );
};

export default LoggedUser;
