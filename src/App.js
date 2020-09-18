import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { login, register } from "./services/note";

import { Layout } from "./Components/Layout";

import Navigation from "./Components/Navigation";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Users from "./Components/Users";
import Userpage from "./Components/Userpage";
import Register from "./Components/Register";
import Mentions from "./Components/Mentions";
import NoMatch from "./Components/NoMatch";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    username: null,
    avatar: null,
    follows: null,
  };

  setUser = (username, password) => {
    const user = {
      username,
      password,
    };
    login(user)
      .then((res) => {
        this.setState({
          token: res.data.token,
          username: res.data.username,
          avatar: res.data.avatar,
          follows: res.data.follows,
        });
      })
      .catch((err) => console.error(err));
  };

  Adduser = (id, password, avatar) => {
    const user = {
      id,
      password,
      avatar,
    };
    register(user)
      .then((res) => {
        alert(res.data + " Registered Successfully");
      })
      .catch((err) => console.error(err));
  };

  logout = () => {
    this.setState({ username: null, avatar: null, follows: null, token: null });
  };

  render() {
    const { username, follows, avatar, token } = this.state;
    return (
      <div>
        <Router>
          <Navigation
            username={username}
            setUser={this.setUser}
            logout={this.logout}
          />
          <div style={{ height: "200px" }}></div>
          <Layout>
            <Switch>
              <Route exact path="/">
                <Home username={username} follows={follows} avatar={avatar} />
              </Route>
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
              <Route path="/user/:id">
                <Userpage username={username} follows={follows} token={token} />
              </Route>
              <Route path="/register">
                <Register Adduser={this.Adduser} />
              </Route>
              <Route path="/mentions/:id">
                <Mentions username={username} follows={follows} token={token} />
              </Route>
              <Route component={NoMatch} />
            </Switch>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
