import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";

import {
  allposts,
  unfollowuser,
  followuser,
  uniuser,
  deletepost,
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
    allposts()
      .then((res) => {
        this.setState({ posts: res.data });
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
        allposts()
          .then((res) => {
            this.setState({ posts: res.data });
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
    followuser(followdetails)
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
    unfollowuser(unfollowdetails)
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
              Mention Page of <h3>{Userinfo.username}</h3>
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
              <br />
              <button className="btn btn-default">
                <Link to={`/user/${Userinfo.username}`}>User Page</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-6">
          {posts
            ? posts
                .filter((post) =>
                  post.content.includes(`#${Userinfo.username}`)
                )
                .map((post) => (
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
