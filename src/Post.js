import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";
import like from "./Icons/like.svg";
import axios from "axios";

class Post extends Component {
  state = { like: this.props.likes };

  updatelike = () => {
    const update = {
      timestamp: this.props.timestamp,
    };
    axios
      .put("/api/follow", update)
      .then((res) => {
        this.setState({ like: res.data });
      })
      .catch((err) => console.error(err));
  };

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
              <button
                onClick={this.props.delete.bind(this, this.props.timestamp)}
                className="btn btn-outline-danger float-right"
              >
                Delete
              </button>
            ) : (
              ""
            )}
            {x ? (
              <button
                className="btn btn-outline-light float-right text-black-50"
                onClick={this.updatelike}
              >
                <img src={like} alt="like" /> {this.state.like}
              </button>
            ) : (
              <button
                className="btn btn-outline-light float-right text-black-50"
                disabled
              >
                <img src={like} alt="like" /> {this.state.like}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
