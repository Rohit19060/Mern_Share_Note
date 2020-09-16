import React, { Component } from "react";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      avatar: "",
    };
    this.formHandler = this.formHandler.bind(this);
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  formHandler = (e) => {
    e.preventDefault();
    this.props.Adduser(this.state.id, this.state.password, this.state.avatar);
    document.getElementById("registerform").reset();
  };

  render() {
    return (
      <form
        onSubmit={this.formHandler}
        className="container p-5 text-center"
        id="registerform"
      >
        <input
          type="text"
          name="id"
          className="form-control"
          onChange={this.onChange}
          placeholder="Id"
          required
        />
        <br />
        <input
          className="form-control"
          type="text"
          name="avatar"
          placeholder="Avatar Link"
          onChange={this.onChange}
          required
        />
        <br />
        <input
          className="form-control"
          type="password"
          name="password"
          placeholder="Password"
          onChange={this.onChange}
          required
        />
        <br />
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
    );
  }
}
export default Register;
