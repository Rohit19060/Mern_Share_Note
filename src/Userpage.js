import React, { Component } from "react";
import { BrowserRouter as Switch, Link } from "react-router-dom";

import axios from "axios";
import Post from "./Post";

class Userpage extends Component {
  state = {
    posts: "",
    Userinfo: "",
    follow: "",
  };
  componentDidMount() {
    const id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        this.setState({ posts: res.data.map((data) => data) });
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`http://localhost:5000/api/user/${id}`)
      .then((res) => {
        this.setState({ Userinfo: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    if (this.props.username) {
      axios
        .get(`http://localhost:5000/api/user/${this.props.username}`)
        .then((res) => {
          this.setState({ follow: res.data.follows });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  delete = (time) => {
    axios
      .delete("http://localhost:5000/api/delpost?time=" + time)
      .then((res) => {
        const id = window.location.href.substring(
          window.location.href.lastIndexOf("/") + 1
        );
        axios
          .get(`http://localhost:5000/api/posts/${id}`)
          .then((res) => {
            this.setState({ posts: res.data.map((data) => data) });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.error(err));
  };

  follow = (user, follow) => {
    const followdetails = {
      user: user,
      follow: follow,
    };
    axios
      .post("http://localhost:5000/api/follow", followdetails)
      .then((res) => {
        this.setState({ follow: res.data });
      })
      .catch((err) => console.error(err));
  };

  unfollow = (user, unfollow) => {
    const unfollowdetails = {
      user: user,
      follow: unfollow,
    };
    axios
      .post("http://localhost:5000/api/unfollow", unfollowdetails)
      .then((res) => {
        this.setState({ follow: res.data });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { Userinfo, posts, follow } = this.state;
    const { username } = this.props;
    return (
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-2">
          <div className="userpanel panel panel-default text-center newmd">
            <div className="panel-heading">
              <div className="panel-body">
                <img src={Userinfo.avatar} alt="avatar" className="img-fluid" />
                <h3>{Userinfo.username}</h3>
                {username && username !== Userinfo.username ? (
                  follow.includes(Userinfo.username) ? (
                    <div>
                      <br />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={this.unfollow.bind(
                          this,
                          username,
                          Userinfo.username
                        )}
                      >
                        Unfollow
                      </button>
                    </div>
                  ) : (
                    <div>
                      <br />
                      <button
                        className="btn btn-outline-success"
                        onClick={this.follow.bind(
                          this,
                          username,
                          Userinfo.username
                        )}
                      >
                        Follow
                      </button>
                    </div>
                  )
                ) : (
                  ""
                )}
                <button className="btn btn-default">
                  <Link to={`/mentions/${Userinfo.username}`}>
                    Mention Page
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-6">
          {posts
            ? posts.map((post) => (
                <Post
                  delete={this.delete}
                  x={username}
                  key={post._id}
                  displayName={post.user}
                  timestamp={post.timestamp}
                  text={post.content}
                  avatar={post.avatar}
                />
              ))
            : ""}
        </div>
      </div>
    );
  }
}
export default Userpage;
