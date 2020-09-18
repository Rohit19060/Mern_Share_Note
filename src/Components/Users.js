import React, { useState, useEffect } from "react";
import { alluser } from "../services/note";
import User from "./User";

function Users() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    alluser()
      .then((res) => {
        setUser(res.data.map((data) => data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="row text-center">
      {user.map((user) => (
        <User key={user._id} id={user.id} avatar={user.avatar} />
      ))}
    </div>
  );
}

export default Users;
