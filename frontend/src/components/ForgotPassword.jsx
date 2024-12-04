import React, { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container"
      style={{
        width: "25rem",
        height: "30rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <form onSubmit={handleSubmit} className='signin'
        style={{
          borderRadius: "1rem",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        }}>
        <div className="logo"
          style={{ marginBottom: "3rem" }}>
          <img src="/logo.png" alt="logo" />
          <div className="logo-name">TuteeTutor</div>
        </div>
        <h1 style={{ marginBottom: "2.7rem", fontSize:"1.9rem" }}>Forgot Password</h1>
        <input
          style={{ marginBottom: "3rem" }}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id='login-input'
          required
        />
        <button type="submit" className='login-button' >Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPasswordForm;
