import React, { useState, useEffect } from "react";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import "../styles/Login.css";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [type, setType] = useState("signIn");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          try {
              // Decode the JWT and extract the role
              const decodedToken = jwtDecode(token);
              setUser(decodedToken);

              // Check token expiration (optional)
              if (decodedToken.exp * 1000 >= Date.now()) {
                  console.log("Token has expired");
                  localStorage.removeItem('token'); // Remove expired token
                  navigate('/dashboard'); // Redirect to login if token is expired
              }
          } catch (error) {
              console.error("Invalid token");
          }
      }
  }, [navigate]);

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



