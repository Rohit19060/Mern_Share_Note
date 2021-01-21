import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Switch, Link } from "react-router-dom";
import Post from "./Post";
import { allposts, save, uniuser, deletepost } from "../services/note";

// Home page component
class Home extends Component {
  state = {
    content: "",
    posts: null,
    follow: null,
  };
  componentDidMount() {
    // Getting Id from Props as username
    const id = this.props.username;
    // Based on login request performs
    id
      ? uniuser(id)
          .then((res) => {
            this.setState({ follow: res.data.follows });
            allposts()
              .then((res) => {
                this.setState({ posts: res.data });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          })
      : allposts()
          .then((res) => {
            this.setState({ posts: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // New post forn handler
  formHandler = (e) => {
    e.preventDefault();
    const note = {
      content: this.state.content,
      user: this.props.username,
      avatar: this.props.avatar,
    };
    save(note)
      .then((res) => {
        // adding new post with old posts using spread operator
        this.setState({ posts: [res.data, ...this.state.posts] });
        this.setState({ content: "" });
        document.getElementById("postform").reset();
      })
      .catch((err) => console.error(err));
  };

  // Delete function based on timestamp
  delete = (time) => {
    deletepost(time)
      .then((res) => {
        this.setState({ posts: res.data });
      })
      .catch((err) => console.error(err));
  };

  render() {
    // Destructuring from state and props
    const { follow, posts } = this.state;
    const { username, follows, avatar } = this.props;
    const folow = follow == null ? follows : follow;
    return (
      <div className="row">
        {username ? (
          <>
            <div className="col-md-2"></div>
            <div className="col-md-2">
              <div className="panel panel-default newmd text-center">
                <div className="panel-heading h3">Welcome {username}</div>
                <div className="panel-body">
                  <img
                    src={avatar}
                    alt="avatar"
                    width="200px"
                    className="text-center"
                  />
                  <br />
                  <Link to={`/user/${username}`}>User Page</Link>
                  <br />
                  <Link to={`/mentions/${username}`}>Mention Page</Link>
                  <br />
                  <br />
                  {folow.length > 0 ? (
                    <p> You are Following: </p>
                  ) : (
                    <p> You are not Following anyone yet</p>
                  )}
                  <ul>
                    <ul className="list-unstyled ">
                      {folow.map((e) => (
                        <Link to={`/user/${e}`} key={e}>
                          <li className="text-success">{e}</li>
                        </Link>
                      ))}
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <form onSubmit={this.formHandler} id="postform">
                <textarea
                  name="content"
                  className="form-control"
                  rows="3"
                  placeholder="What's on your mind?"
                  onChange={this.onChange}
                  required
                ></textarea>
                <input
                  type="submit"
                  className="btn btn-outline-primary"
                  name="submit"
                  value="Submit"
                />
              </form>
              {posts
                ? posts
                    .filter(
                      (post) =>
                        folow.includes(post.user) || post.user === username
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
          </>
        ) : (
          <>
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <h2 className="text-center">
                <span role="img" aria-label="emoji">
                  🤩
                </span>
                Welcome Happy to See you here
                <span role="img" aria-label="emoji">
                  🤩
                </span>
              </h2>
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
          </>
        )}
      </div>
    );
  }
}

export default Home;
