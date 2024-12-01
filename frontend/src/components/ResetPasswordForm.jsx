import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordForm() {
  const { token } = useParams(); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.text();
      setMessage(data);

      if (response.ok) {
        // Redirect the user to login after successful password reset
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      setMessage('Error occurred while resetting password. Please try again.');
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
        <div className="logo"
          style={{ marginBottom: "3rem" }}>
          <img src="/logo.png" alt="TuteeTutor Logo"/>
          <div className="logo-name">TuteeTutor</div>
        </div>
        <h1 style={{ marginBottom: "2.7rem", fontSize: "1.9rem" }}>Reset Password</h1>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "3rem" }}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPasswordForm;
