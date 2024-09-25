import React, { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:2004/api/forgot-password', {
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
      <form onSubmit={handleSubmit}
        style={{
          borderRadius: "1rem",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        }}>
        <div class="logo"
          style={{ marginBottom: "3rem" }}>
          <img src="/logo.png" />
          <div class="logo-name">TuteeTutor</div>
        </div>
        <h1 style={{ marginBottom: "2.7rem", fontSize:"1.9rem" }}>Forgot Password</h1>
        <input
          style={{ marginBottom: "3rem" }}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPasswordForm;
