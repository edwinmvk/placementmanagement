import React, { useContext } from "react";
import { Context } from "../../utils/ContextProvider";

const User = () => {
  const { googleUser, googleSignOut } = useContext(Context);

  const handleSignOut = async () => {
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1>Hello user: {googleUser?.displayName}</h1>
      <button onClick={handleSignOut}>Logout</button>
    </div>
  );
};

export default User;
