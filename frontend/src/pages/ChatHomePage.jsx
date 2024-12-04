import React from "react";
import { Link } from "react-router-dom";

const ChatHomePage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Chatbot App</h1>
      <p>Navigate to the chat page to start chatting!</p>
      <Link to="/chat">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Go to Chat
        </button>
      </Link>
    </div>
  );
};

export default ChatHomePage;
