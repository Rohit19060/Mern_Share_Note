import React, { Component } from "react";
import Post from "./Post";
import axios from "axios";
class Home extends Component {
  state = {
    content: "",
    posts: null,
  };
  componentDidMount() {
    axios
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
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { username, follows, avatar } = this.props;
    return (
      <div className="row">
        {username ? (
          <>
            <div className="col-md-2"></div>
            <div className="col-md-2">
              <div className="panel panel-default text-center newmd">
                <div className="panel-heading h3">Welcome {username}</div>
                <div className="panel-body"></div>
              </div>
            </div>
            <div className="col-md-6">
              <form onSubmit={this.formHandler}>
                <textarea
                  name="content"
                  className="form-control"
                  rows="3"
                  placeholder="What's on your mind?"
                  onChange={this.onChange}
                ></textarea>
                <input
                  type="submit"
                  className="btn btn-outline-primary"
                  name="submit"
                  value="Submit"
                />
              </form>
              {this.state.posts
                ? this.state.posts.map((post) => (
                    <Post
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
