import React, { Component } from "react";
import { BrowserRouter as Switch, Link } from "react-router-dom";
import Post from "./Post";
import axios from "axios";
class Home extends Component {
  state = {
    content: "",
    posts: null,
    follow: [],
  };
  componentDidMount() {
    const id = this.props.username;
    id
      ? axios
          .get(`http://localhost:5000/api/user/${id}`)
          .then((res) => {
            this.setState({ follow: res.data.follows });
            axios
              .get("http://localhost:5000/api/posts")
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
      : axios
          .get("http://localhost:5000/api/posts")
          .then((res) => {
            this.setState({ posts: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  formHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/posts", {
        content: this.state.content,
        user: this.props.username,
        avatar: this.props.avatar,
      })
      .then((res) => {
        this.setState({ posts: [...this.state.posts, res.data] });
        this.setState({ content: "" });
        document.getElementById("postform").reset();
      })
      .catch((err) => console.error(err));
  };

  delete = (time) => {
    axios
      .delete("http://localhost:5000/api/delpost?time=" + time)
      .then((res) => {
        this.setState({ posts: res.data });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { username, follows, avatar } = this.props;
    let folow = this.state.follow == null ? follows : this.state.follow;
    return (
      <div className="row">
        {username ? (
          <>
            <div className="col-md-2"></div>
            <div className="col-md-2">
              <div className="panel panel-default newmd">
                <div className="panel-heading h3">Welcome {username}</div>
                <div className="panel-body">
                  <img
                    src={avatar}
                    alt="avatar"
                    width="200px"
                    className="text-center"
                  />
                  {folow.length > 0 ? (
                    <p> You are Following: </p>
                  ) : (
                    <p> You are not Following anyone yet</p>
                  )}
                  <ul>
                    <ul>
                      {folow.map((e) => (
                        <Link to={`/user/${e}`}>
                          <li>{e}</li>
                        </Link>
                      ))}
                    </ul>
                  </ul>
                </div>
                <button className="btn btn-default">
                  <Link to={`/user/${username}`}>Your Page</Link>
                </button>
                <br />
                <button className="btn btn-default">
                  <Link to={`/mentions/${username}`}>Mention Page</Link>
                </button>
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
              {this.state.posts
                ? this.state.posts
                    .filter((post) => folow.includes(post.user))
                    .map((post) => (
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
              {this.state.posts
                ? this.state.posts
                    .filter((post) => post.user === username)
                    .map((post) => (
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
          </>
        ) : (
          <>
            <div className="col-md-2"></div>
            <div className="col-md-8">
              {this.state.posts
                ? this.state.posts.map((post) => (
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
          </>
        )}
      </div>
    );
  }
}

export default Home;
