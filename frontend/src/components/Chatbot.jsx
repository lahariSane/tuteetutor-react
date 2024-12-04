import React, { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentMenu, setCurrentMenu] = useState("main"); // Tracks the current menu
  const chatContainerRef = useRef(null);

  // Main menu options
  const mainMenuOptions = [
    {
      question: "Hi",
      response: "Hello! Welcome to TuteeTutor. How can I assist you today?",
    },
    {
      question: "Features",
      response:
        "TuteeTutor offers features like classroom management, leave requests, personal to-dos, and more. Would you like more details on a specific feature?",
    },
    {
      question: "Thank you",
      response: "You're welcome! Feel free to ask if you have more questions.",
    },
  ];

  // Help menu options
  const helpMenuOptions = [
    {
      question: "How can I join a class?",
      answer:
        "You can join a class using the class code provided by your teacher. Enter the code in the 'Join Class' section.",
    },
    {
      question: "How do I submit an assignment?",
      answer:
        "Go to the 'Assignments' section, select the assignment, upload your file, and click 'Submit'.",
    },
    {
      question: "How can I send a leave request?",
      answer:
        "Navigate to the 'Leave Requests' section, fill out the form with the required details, and submit it.",
    },
    {
      question: "Can I create a personal to-do list?",
      answer:
        "Yes, you can create and manage your personal to-dos in the 'To-Do List' section. Add tasks, mark them as complete, and stay organized.",
    },
    {
      question: "How do I access class materials?",
      answer:
        "Class materials shared by your teacher can be found in the 'Classroom Materials' section under each class.",
    },
    {
      question: "How do I participate in class discussions?",
      answer:
        "You can participate in discussions in the 'Class Discussions' section. Post your comments or reply to others.",
    },
    {
      question: "How do I check my grades?",
      answer:
        "Grades are available in the 'Grades' section. You'll see an overview of your performance in each class.",
    },
    {
      question: "Thank you",
      answer:
        "You're welcome! Let me know if there's anything else I can help with.",
    },
  ];

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMainMenu = () => {
    setCurrentMenu("main");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        text: "You are back to the main menu. Here are your options:",
      },
    ]);
  };

  const handleMessage = (input) => {
    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Handle main menu inputs
    if (currentMenu === "main") {
      const selectedOption = mainMenuOptions.find(
        (option) => option.question === input
      );

      if (selectedOption) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: selectedOption.response },
        ]);

        if (input === "Features") {
          setCurrentMenu("help");
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Sorry, I didn't understand that. Please select an option.",
          },
        ]);
      }
    }

    // Handle help menu inputs
    else if (currentMenu === "help") {
      const selectedOption = helpMenuOptions.find(
        (option) => option.question === input
      );

      if (selectedOption) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: selectedOption.answer },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Sorry, I didn't understand that. Please select an option.",
          },
        ]);
      }
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "120px 0px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        width: "400px"
      }}
    >
      <h2 style={{ textAlign: "center" }}>TuteeTutor ChatBot</h2>
      <div
        ref={chatContainerRef}
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.sender === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                backgroundColor:
                  message.sender === "user" ? "#007bff" : "#f1f1f1",
                color: message.sender === "user" ? "#fff" : "#000",
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "10px",
                maxWidth: "75%",
              }}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {(currentMenu === "main" ? mainMenuOptions : helpMenuOptions).map(
          (option, index) => (
            <button
              key={index}
              onClick={() => handleMessage(option.question)}
              style={{
                flex: "1 1 calc(50% - 10px)",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#555",
                color: "#fff",
                border: "1px solid #666",
                cursor: "pointer",
              }}
            >
              {option.question}
            </button>
          )
        )}

        {currentMenu !== "main" && (
          <button
            onClick={handleMainMenu}
            style={{
              flex: "1 1 calc(50% - 10px)",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#555",
              color: "#fff",
              border: "1px solid #666",
              cursor: "pointer",
            }}
          >
            Back to Main Menu
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleMessage(userInput)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            height: "40px",
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginRight: "10px",
          }}
        />
        <button
          onClick={() => handleMessage(userInput)}
          style={{
            height: "40px",
            padding: "0 16px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
