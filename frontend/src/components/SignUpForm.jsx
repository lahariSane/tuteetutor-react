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
  const [step, setStep] = useState("signup");

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/send-otp`,
        { email: state.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.exists) {
        setError("User already exists. Please login instead.");
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

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setError("");
    try {
      setLoading(true);
      const { name, email, password, otp } = state;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/signup`,
        { name, email, password, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Signup successful!");
      window.location.href = "/";
    } catch (error) {
      const message = error.response?.data?.message || "Error in signup.";
      setError(message);
      alert(message);
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
        { email: state.email, otp: state.otp },
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
          <form onSubmit={handleOnSubmit}>
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
              <button
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <h1 className="heading">Verify OTP</h1>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={state.otp}
              onChange={handleChange}
              required
            />
            <button type="submit"  disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div >
  );
}

export default SignUpForm;
