import React, { Component } from "react";
import { BrowserRouter as Switch, Link } from "react-router-dom";

class Post extends Component {
  render() {
    const { displayName, timestamp, text, x, avatar } = this.props;
    return (
      <div className="p-3 img-thumbnail mt-4">
        <div className="row">
          <div className="col-1 text-center">
            <img src={avatar} width="35px" alt="avatar" />
          </div>
          <div className="col-11">
            <Link to={`/user/${displayName}`}>@{displayName}</Link>
            <span> {timestamp}</span>
            <div>{text}</div>
            {x && x === displayName ? (
              <button className="btn btn-outline-danger float-right">
                Delete
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
