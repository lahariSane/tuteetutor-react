import React from "react";
import ChatBot from "../components/Chatbot";

const ChatPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        marginLeft: "400px",
        height: "100vh", // Full height of the viewport
        width: "100vw",
      }}
    >
        <ChatBot />
     </div>
  );
};

export default ChatPage;
