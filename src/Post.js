import React from "react";
import { BrowserRouter as Switch, Link } from "react-router-dom";

const Post = ({ displayName, timestamp, text }) => {
  return (
    <div className="container p-3 img-thumbnail mt-4">
      <Link to={`/user/${displayName}`}>@{displayName}</Link>
      <span>{timestamp}</span>
      <div>{text}</div>
    </div>
  );
};

export default Post;
