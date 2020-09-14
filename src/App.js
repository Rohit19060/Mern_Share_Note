import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Users from "./Users";
import Userpage from "./Userpage";
import Register from "./Register";
import Mentions from "./Mentions";
import NoMatch from "./NoMatch";
import axios from "axios";
import { Layout } from "./Components/Layout";
import NavigationBar from "./Components/NavigationBar";
import "./App.css";
class App extends Component {
  state = {
    units: [],
    username: null,
    avatar: null,
    follows: null,
  };

  setUser = (username, password) => {
    const user = {
      username,
      password,
    };
    axios
      .post("http://localhost:5000/api/login", user)
      .then((res) => {
        console.log(res.data);
        this.setState({
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
    axios
      .post("http://localhost:5000/api/register", user)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  logout = () => {
    this.setState({ username: null, avatar: null, follows: null });
    console.log("Logout Successfully");
  };

  render() {
    return (
      <div>
        <Router>
          <NavigationBar
            username={this.state.username}
            setUser={this.setUser}
            logout={this.logout}
          />
          <div style={{ height: "200px" }}></div>
          <Layout>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/user/:id">
                <Userpage />
              </Route>
              <Route path="/register">
                <Register Adduser={this.Adduser} />
              </Route>
              <Route path="/mentions/:id">
                <Mentions />
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