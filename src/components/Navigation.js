import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
//   const displayName = userObj === null ? "acrofuture" : userObj.displayName;
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">{userObj.displayName}'s Profile</Link>
      </li>
    </ul>
  );
};

Navigation.defaultProps = {
    userObj: {displayName : 'Anonymous'},
};

export default Navigation;
