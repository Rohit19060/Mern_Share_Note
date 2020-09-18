import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";
import like from "../Icons/like.svg";
import { likeupdate } from "../services/note";

class Post extends Component {
  state = { likes: this.props.post.likes };

  updatelike = () => {
    const update = {
      timestamp: this.props.post.timestamp,
    };
    likeupdate(update)
      .then((res) => {
        this.setState({ likes: res.data });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { user, timestamp, content, avatar } = this.props.post;
    const x = this.props.x;
    const likes = this.state.likes;
    return (
      <div className="p-3 img-thumbnail mt-4">
        <div className="row">
          <div className="col-1 text-center">
            <img src={avatar} width="35px" alt="avatar" />
          </div>
          <div className="col-11">
            <Link to={`/user/${user}`}>@{user}</Link>
            <span> {timestamp}</span>
            <div>{content}</div>
            {x && x === user ? (
              <button
                onClick={this.props.delete.bind(this, timestamp)}
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
                <img src={like} alt="like" /> {likes}
              </button>
            ) : (
              <button
                className="btn btn-outline-light float-right text-black-50"
                disabled
              >
                <img src={like} alt="like" /> {likes}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
