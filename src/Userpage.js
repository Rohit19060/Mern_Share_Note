import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter as Switch, Link } from "react-router-dom";

import axios from "axios";
import Post from "./Post";
function Userpage({ username }) {
  const [posts, setPosts] = useState([]);
  const [userinfo, setUserinfo] = useState([]);
  const id = useParams().id;
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        setPosts(res.data.map((data) => data));
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`http://localhost:5000/api/user/${id}`)
      .then((res) => {
        setUserinfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  return (
    <div className="row">
      <div className="col-md-2"></div>
      <div className="col-md-2">
        <div className="userpanel panel panel-default text-center newmd">
          <div className="panel-heading">
            <div className="panel-body">
              <img src={userinfo.avatar} alt="avatar" className="img-fluid" />
              <form id="followform" className="" method="post" action="/follow">
                <div className="btn-group-vertical" role="group">
                  <input
                    type="submit"
                    className="btn btn-default"
                    name="submit"
                    value="Follow Bean"
                  />
                  <button className="btn btn-default">
                    <Link to={`/user/${userinfo.username}`}>
                      User Page of {userinfo.username}
                    </Link>
                  </button>
                  <button className="btn btn-default">
                    <a href="/mentions/Bean">Mentions of Bean</a>
                  </button>
                  <input type="hidden" name="who" value="Bean" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-1"></div>
      <div className="col-md-6">
        {posts.map((post) => (
          <Post
            x={username}
            key={post._id}
            displayName={post.user}
            timestamp={post.timestamp}
            text={post.content}
            avatar={post.avatar}
          />
        ))}
      </div>
    </div>
  );
}

export default Userpage;
