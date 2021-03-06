import React, { Component } from "react";
import { Link } from "react-router-dom";

// Main navigation component
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.formHandler = this.formHandler.bind(this);
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // Login form handler
  formHandler = (e) => {
    e.preventDefault();
    this.props.setUser(this.state.username, this.state.password);
    document.getElementById("loginform").reset();
  };

  render() {
    return (
      <div className="navbar navbar-expand-md navbar-dark fixed-top bg-white rounded navigation">
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggler bg-primary text-white"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span> Share Note
            </button>
          </div>
          <div
            className="collapse navbar-collapse text-center align-content-center"
            id="navbarCollapse"
          >
            <ul className="navbar-nav mr-auto">
              <li>
                <Link to="/" className="links">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/users" className="links">
                  Users
                </Link>
              </li>
              <li>
                <Link to="/about" className="links">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="links">
                  Contact
                </Link>
              </li>
            </ul>
            {this.props.username ? (
              <button
                onClick={this.props.logout}
                className="btn btn-outline-danger"
              >
                Logout
              </button>
            ) : (
              <>
                <form
                  onSubmit={this.formHandler}
                  className="form-check-inline"
                  id="loginform"
                >
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    onChange={this.onChange}
                    placeholder="Username"
                    required
                  />
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.onChange}
                    required
                    autocomplete="on"
                  />
                  <input
                    type="submit"
                    value="Login"
                    className="btn btn-outline-primary"
                  />
                </form>
                <Link to="/register">
                  <button className="btn btn-outline-primary">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Navigation;
