import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";
import {
  unipost,
  uniuser,
  deletepost,
  followuser,
  unfollowuser,
} from "../services/note";
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
    unipost(id)
      .then((res) => {
        this.setState({ posts: res.data.map((data) => data) });
      })
      .catch((err) => {
        console.log(err);
      });
    uniuser(id)
      .then((res) => {
        this.setState({ Userinfo: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    if (this.props.username) {
      uniuser(this.props.username)
        .then((res) => {
          this.setState({ follow: res.data.follows });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  delete = (time) => {
    deletepost(time)
      .then((res) => {
        const id = window.location.href.substring(
          window.location.href.lastIndexOf("/") + 1
        );
        unipost(id)
          .then((res) => {
            this.setState({ posts: res.data.map((data) => data) });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.error(err));
  };

  follow = (token, follow) => {
    const followdetails = {
      token: token,
      follow: follow,
    };
    followuser(followdetails)
      .then((res) => {
        this.setState({ follow: res.data });
      })
      .catch((err) => console.error(err));
  };

  unfollow = (token, unfollow) => {
    const unfollowdetails = {
      token: token,
      follow: unfollow,
    };
    unfollowuser(unfollowdetails)
      .then((res) => {
        this.setState({ follow: res.data });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { Userinfo, posts, follow } = this.state;
    const { username, token } = this.props;
    return (
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-2">
          <div className="userpanel panel panel-default text-center newmd">
            <div className="panel-heading">
              User Page of <h3>{Userinfo.username}</h3>
            </div>
            <div className="panel-body">
              <img src={Userinfo.avatar} alt="avatar" className="img-fluid" />
              {username && username !== Userinfo.username ? (
                follow.includes(Userinfo.username) ? (
                  <div>
                    <br />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={this.unfollow.bind(
                        this,
                        token,
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
                      onClick={this.follow.bind(this, token, Userinfo.username)}
                    >
                      Follow
                    </button>
                  </div>
                )
              ) : (
                ""
              )}
              <br />
              <button className="btn btn-default">
                <Link to={`/mentions/${Userinfo.username}`}>Mention Page</Link>
              </button>
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
                  post={post}
                />
              ))
            : ""}
        </div>
      </div>
    );
  }
}
export default Userpage;
