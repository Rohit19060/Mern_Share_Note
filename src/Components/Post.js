import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";
import like from "../Icons/like.svg";
import { likeupdate } from "../services/note";
import { postusers } from "../services/note";

// Post component for all the posts
class Post extends Component {
  state = { likes: this.props.post.likes, users: [] };

  componentDidMount() {
    postusers()
      .then((res) => {
        console.log(res.data);
        this.setState({ users: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
    // Destructuring
    const { user, timestamp, content, avatar } = this.props.post;

    // Advanced post view
    let contentx = content.split(" ");
    let data = [];
    for (let i = 0; i < contentx.length; i++) {
      let link = "";
      if (this.state.users.includes(contentx[i].substring(1))) {
        let user = contentx[i].charAt(1).toUpperCase() + contentx[i].slice(2);
        if (contentx[i].charAt(0) === "#") {
          link = <Link to={`/mentions/${user}`}>{contentx[i]}</Link>;
        } else if (contentx[i].charAt(0) === "@") {
          link = <Link to={`/user/${user}`}>{contentx[i]}</Link>;
        } else {
          link = contentx[i];
        }
      } else {
        link = contentx[i];
      }
      data.push(link);
      data.push(" ");
    }

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
            <div>{data}</div>
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
