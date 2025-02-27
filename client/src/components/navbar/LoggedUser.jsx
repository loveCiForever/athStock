// .client/src/components/navbar/LoggedUser.jsx

import UserNav from "./UserNav";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

const LoggedUser = () => {
  const [toggleLinks, setToggleLinks] = useState(false);
  const { user } = useAuthContext();

  return (
    <div
      className="flex items-center justify-center relative"
      onClick={() => setToggleLinks((prev) => !prev)}
    >
      <button className="h-10 w-10 lg:w-12 lg:h-12 flex items-center justify-center">
        <img
          src={user.profile_img}
          alt="profile image"
          className="w-[70%] border border-grey/90 object-cover rounded-full"
        />
      </button>
      {toggleLinks && <UserNav />}
    </div>
  );
};

export default LoggedUser;
