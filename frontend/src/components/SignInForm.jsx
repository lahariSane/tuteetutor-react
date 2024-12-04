import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";

function SignInForm() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      user.role === "student" ? navigate("/coursesSelection") : navigate("/");
    } else if (code) {
      setLoading(true);

      // Exchange GitHub code for access token
      const getGitHubAccessToken = async () => {
        try {
          const backendResponse = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/github-login`, 
            { code }
          );

          // Store the backend-issued token and navigate
          localStorage.setItem(
            "token",
            backendResponse.data.token
          );
          setLoading(false);
          navigateBasedOnRole(backendResponse.data.token);
        } catch (error) {
          setLoading(false);
          setError("Failed to authenticate with GitHub. Please try again.");
        }
      };

      getGitHubAccessToken();
    }
  }, [code, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  const navigateBasedOnRole = (token) => {
    const user = jwtDecode(token);
    user.role === "student" ? navigate("/coursesSelection") : navigate("/");
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        state
      );
      localStorage.setItem("token", response.data.token);
      navigateBasedOnRole(response.data.token);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred.";

      if (message.toLowerCase().includes("email")) {
        setEmailError("Invalid email address.");
      } else if (message.toLowerCase().includes("password")) {
        setPasswordError("Incorrect password.");
      } else {
        setError(`Login failed: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/google-login`,
          tokenResponse
        );
        localStorage.setItem("token", response.data.token);
        navigateBasedOnRole(response.data.token);
      } catch (error) {
        const message =
          error.response?.data?.message || "An unexpected error occurred.";
        setError(`Google login failed: ${message}`);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login failed. Please try again."),
  });

  const githubLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/login`;
    const scope = "read:user";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <div className="box-container">
      <div className="form-container sign-in-container">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <div className="logo-name">TuteeTutor</div>
        </div>
        <form className='signin' onSubmit={handleOnSubmit} style={{ height: "650px" }}>
          <h1 className="heading">Sign in</h1>
          <div className="social-container">
            <span type="button" className="auth-button" onClick={googleLogin}>
              <i className="fab fa-google" />
            </span>
            <span type="button" className="auth-button" onClick={githubLogin}>
              <i className="fab fa-github" />
            </span>
          </div>
          <span className="additional-information">or use your account</span>
          <div className="input-group">
            <label
              className={`floating-label ${state.email ? "active" : ""}`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder=""
              value={state.email}
              onChange={handleChange}
              className={emailError ? "input-error" : ""}
              id='login-input'
              required
            />
            {emailError && (
              <div className="inline-error">
                <i className="fas fa-exclamation-circle" /> {emailError}
              </div>
            )}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
              className={passwordError ? "input-error" : ""}
              id='login-input'
              required
            />
            {passwordError && (
              <div className="inline-error">
                <i className="fas fa-exclamation-circle" /> {passwordError}
              </div>
            )}
          </div>
          <a href="/forgot-password" className="forgot-password">
            Forgot your password?
          </a>
          {error && <div className="error-message">{error}</div>}
          <button className='login-button' type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
