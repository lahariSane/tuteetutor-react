import React, { useState } from "react";

function SignUpForm() {
  const [state, setState] = useState({ name: "", email: "", password: "", otp: "" });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleSendOtp = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.email }),
    });
    if (response.ok) {
      alert('OTP sent to your email');
    } else { 
      const errorMessage = await response.text(); 
      alert(`Error: ${response.status} - ${errorMessage}`);
    }
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { name, email, password, otp } = state;

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, otp }),
    });

    if (response.ok) {
      window.location.href = '/';
    } else {
      alert('Error in signup');
    }
  };

  return (
    <div class="box-container">
      <div className="form-container sign-up-container">
        <div class="logo">
          <img src="/logo.png" alt="logo"/>
          <div class="logo-name">TuteeTutor</div>
        </div>
        <form onSubmit={handleOnSubmit}>
          <h1 className="heading">Create Account</h1>
          <div className="social-container">
            <a href="/" className="social">
              <i className="fab fa-google" />
            </a>
            <a href="/" className="social">
              <i className="fab fa-github" />
            </a>
          </div>
          <span class="additional-information">or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={state.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={state.password}
            onChange={handleChange}
            required
          />
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "calc(100% - 36px)" }}>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={state.otp}
              onChange={handleChange}
              style={{ width: "13rem" }}
              required
            />
            <button type="button" className="send-otp" onClick={handleSendOtp}>Send OTP</button>
          </div>
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
