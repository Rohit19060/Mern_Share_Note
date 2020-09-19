import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";

// For one user view this component is usefull
const User = ({ id, avatar }) => {
  return (
    <div className="col-xs-6 col-md-4 mb-4">
      <Link to={`/user/${id}`}>
        <img src={avatar} alt={id} />
        <h4 className="m-2">@{id}</h4>
      </Link>
    </div>
  );
};

export default User;
