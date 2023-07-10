import React, { useState } from "react";
import { authService } from "fbase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const Profile = ({ userObj, action }) => {
  //   console.log(userObj);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    await authService.signOut();
    navigate("/");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, { displayName: newDisplayName });
      if (typeof action === "function") {
        action();
      }
    }
  };
  const onChange = ({ target: { value } }) => {
    setNewDisplayName(value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="update name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update profile" />
      </form>
      <button onClick={onLogoutClick}>Log out</button>
    </>
  );
};

export default Profile;
