import React, { useState } from "react";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import "../styles/Login.css";


function Login() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="App">
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us, please login with your personal info.
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us.</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
