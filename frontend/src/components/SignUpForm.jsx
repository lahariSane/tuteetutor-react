import React, { useState } from "react";

function SignUpForm() {
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
    alert(`You are signed up with email: ${email} and password: ${password}`);
    setState({ email: "", password: "" });
  };

  return (
    <div class="box-container">
      <div className="form-container sign-up-container">
        <div class="logo">
          <img src="/logo192.png" />
          <div class="logo-name">TuteeTutor</div>
        </div>
        <form onSubmit={handleOnSubmit}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-google" />
            </a>
            <a href="#" className="social">
              <i className="fab fa-github" />
            </a>
          </div>
          <span class="additional-information">or use your email for registration</span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={state.password}
            onChange={handleChange}
          />
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
