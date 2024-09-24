import React, { useState } from "react";
// import { Link } from 'react-router-dom';


function SignInForm() {
  const [state, setState] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    const { email, password } = state;
    alert(`You are logged in with email: ${email} and password: ${password}`);
    setState({ email: "", password: "" });
  };

  return (
    <div class="box-container">
      <div className="form-container sign-in-container" >
        <div class="logo">
          <img src="/logo.png" />
          <div class="logo-name">TuteeTutor</div>
        </div>
        <form onSubmit={handleOnSubmit} style={{height:"650px"}}>
          <h1 className="heading">Sign in</h1>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-google" />
            </a>
            <a href="#" className="social">
              <i className="fab fa-github" />
            </a>
          </div>
          <span class="additional-information">or use your account</span>

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />

          <a href="/forgot-password" className="forgot-password">
            Forgot your password?
          </a>
          <button>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;


