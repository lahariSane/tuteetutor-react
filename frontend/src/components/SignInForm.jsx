import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";

function SignInForm() {
  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
    setError("");
  };
  const login = (data) => {
    if (data.token) {
      // Save token in localStorage
      localStorage.setItem("token", data.token);
  
      // Decode token to get user role
      const user = jwtDecode(data.token);
      if (user.role === "student") {
        navigate("/coursesSelection");
      } else {
        navigate("/");
      }
    } else {
      setError("Login failed: " + (data.message || "Unknown error")); // Error if token is not present
    }
  };
  
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { email, password } = state;
  
    // Reset error state before new login attempt
    setError("");
    try {
      // Send login request to API
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        { email, password }
      );
  
      // Process the response data
      login(response.data);
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      if (error.response && error.response.data) {
        setError("Login failed: " + (error.response.data.message || "Unknown error")); // Server error message
      } else {
        setError("Login failed: An unexpected error occurred."); // General error message
      }
    }
  };
  
  const google_login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send token to backend for verification
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/google-login`,
          tokenResponse
        );
        
        // Process the response data
        login(response.data);
      } catch (error) {
        console.error("Google login error:", error); // Log the error
        if (error.response && error.response.data) {
          setError("Google login failed: " + (error.response.data.message || "Unknown error")); // Server error message
        } else {
          setError("Google login failed: An unexpected error occurred."); // General error message
        }
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error); // Log the Google login error
      setError("Google login failed: An unexpected error occurred."); // General error message
    },
  });
  

  return (
    <div className="box-container">
      <div className="form-container sign-in-container">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <div className="logo-name">TuteeTutor</div>
        </div>
        <form onSubmit={handleOnSubmit} style={{ height: "650px" }}>
          <h1 className="heading">Sign in</h1>
          <div className="social-container">
            <span className="auth-button" onClick={google_login}>
              <i className="fab fa-google" />
            </span>
            <span className="auth-button social">
              <i className="fab fa-github" />
            </span>
          </div>
          <span className="additional-information">or use your account</span>

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
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
            required
          />

          <a href="/forgot-password" className="forgot-password">
            Forgot your password?
          </a>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
