import React from "react";
import ChatBot from "../components/Chatbot";

const ChatPage = () => {
  return (
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">TuteeTutor Support</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Get help with classroom management, assignments, and more through our interactive assistant.
        </p>
        <ChatBot />
      </div>
    
  );
};

export default ChatPage;
