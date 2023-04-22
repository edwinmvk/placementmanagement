import React, { useContext } from "react";
import { Context } from "../../utils/ContextProvider";

const User = () => {
  const { registeredGoogleUser, googleSignOut } = useContext(Context);

  const handleSignOut = async () => {
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl">
        Welcome User <br />
        {registeredGoogleUser.displayName.substring(9)}
      </h1>
      <br /> <br />
      <button className="border" onClick={handleSignOut}>
        Signout
      </button>
    </div>
  );
};

export default User;
