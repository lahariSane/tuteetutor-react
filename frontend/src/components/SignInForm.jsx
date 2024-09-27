import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


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

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { email, password } = state;

    // Reset error state before new login attempt
    setError("");
    try {
      // Fetch request to login API
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle response
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          // Save token in localStorage
          localStorage.setItem('token', data.token);
          // Redirect to /home
          const user = jwtDecode(data.token)
          if (user.role === "student"){
            navigate('/coursesSelection');
          }
          else {
            navigate('/');
          }
        } else {
          setError('Login failed: ' + (data.message || 'Unknown error')); // Set error message if token is not present
        }
      } else {
        const errorData = await response.json();
        setError('Login failed: ' + (errorData.message || 'Unknown error'));// Set error message for non-200 responses
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log any fetch errors
      setError('Login failed: An unexpected error occurred.'); // General error message for fetch failures
    }
  };

  return (
    <div class="box-container">
      <div className="form-container sign-in-container" >
        <div class="logo">
          <img src="/logo.png" alt="logo" />
          <div class="logo-name">TuteeTutor</div>
        </div>
        <form onSubmit={handleOnSubmit} style={{ height: "650px" }}>
          <h1 className="heading">Sign in</h1>
          <div className="social-container">
            <a href="/" className="social">
              <i className="fab fa-google" />
            </a>
            <a href="/" className="social">
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
          {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          <button>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;


