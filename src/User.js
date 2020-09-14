import React from "react";
import { BrowserRouter as Switch, Link } from "react-router-dom";

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