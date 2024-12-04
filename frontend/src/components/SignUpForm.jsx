import React, { useState } from "react";
import axios from "axios"; // Using axios for better error handling and easier API calls
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step, setStep] = useState("signup");

  const handleChange = (evt) => {
    const { name: fieldName, value } = evt.target; // Rename "name" to "fieldName"
    setState({
      ...state,
      [fieldName]: value,
    });
  
    // Validate password on change
    if (fieldName === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    // Check length between 8 and 35
    if (password.length < 8 || password.length > 31) {
      setPasswordError("Password must be between 8 and 31 characters.");
      return;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must include at least one uppercase letter.");
      return;
    }

    // Check for exactly one underscore and no other special characters
    if (!/^([^_]*_){1}[^_]*$/.test(password)) {
      setPasswordError(
        "Password must include exactly one underscore and no other special characters."
      );
      return;
    }

    // Clear error if all conditions are met
    setPasswordError("");
  };

  const handleSendOtp = async () => {
    if (passwordError) {
      alert("Please fix the errors in the password before proceeding.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/send-otp`,
        { email: state.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.exists) {
        alert("User already exists. Please login instead.");
        setLoading(false);
        return;
      }
      else {
        alert("OTP sent to your email.");
        setStep("otpVerification");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP.";
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (evt) => {
    evt.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/verify-otp`,
        { name: state.name, email: state.email, password: state.password, otp: state.otp },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("OTP verified successfully and successfully signed up!");
      window.location.href = "/";

    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP.";
      alert(`Error: ${message}`);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const navigateBasedOnRole = (token) => {
    const user = jwtDecode(token);
    user.role === "student" ? navigate("/coursesSelection") : navigate("/");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/auth/google-login`,
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
    const clientId =
      process.env.REACT_APP_GITHUB_CLIENT_ID || "default_client_id";
    const redirectUri = `${process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000"}/login`;
    const scope = "read:user";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <div className="box-container">
      <div className="form-container sign-up-container">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <div className="logo-name">TuteeTutor</div>
        </div>
        {step === "signup" ? (
          <form className='signin'>
            <h1 className="heading">Create Account</h1>
            <div className="social-container">
              <span type="button" className="auth-button" onClick={googleLogin}>
                <i className="fab fa-google" />
              </span>
              <span type="button" className="auth-button" onClick={githubLogin}>
                <i className="fab fa-github" />
              </span>
            </div>
            <span className="additional-information">
              or use your email for registration
            </span>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={state.name}
              onChange={handleChange}
              id='login-input'
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={state.email}
              onChange={handleChange}
              id='login-input'
              required
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={state.password}
              onChange={handleChange}
              id='login-input'
              required
            />
            {passwordError && (
              <div className="inline-error">
                <i className="fas fa-exclamation-circle" /> {passwordError}
              </div>
            )}  
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className='login-button' 
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className='signin'>
            <h1 className="heading">Verify OTP</h1>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={state.otp}
              onChange={handleChange}
              id='login-input'
              required
            />
            <button className='login-button' type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div >
  );
}

export default SignUpForm;
