import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentMenu, setCurrentMenu] = useState("main");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

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

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // GSAP animation for new messages
  useEffect(() => {
    if (messages.length > 0) {
      const messageElements = document.querySelectorAll('.message-bubble');
      const latestMessage = messageElements[messageElements.length - 1];
      
      if (latestMessage) {
        gsap.fromTo(
          latestMessage,
          { 
            opacity: 0, 
            y: 20,
            scale: 0.9
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
          }
        );
      }
    }
  }, [messages]);

  // Simulate typing effect for bot messages
  const simulateTyping = (text, callback) => {
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(1000, text.length * 15);
    
    setTimeout(() => {
      setIsTyping(false);
      if (callback) callback();
    }, typingDelay);
  };

  const handleMainMenu = () => {
    setCurrentMenu("main");
    
    simulateTyping("You are back to the main menu. Here are your options:", () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "You are back to the main menu. Here are your options:",
        },
      ]);
    });
  };

  const handleMessage = (input) => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");
    
    // Focus back on input after sending
    if (inputRef.current) inputRef.current.focus();

    // Handle main menu inputs
    if (currentMenu === "main") {
      const selectedOption = mainMenuOptions.find(
        (option) => option.question.toLowerCase() === input.toLowerCase()
      );

      if (selectedOption) {
        simulateTyping(selectedOption.response, () => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: selectedOption.response },
          ]);
        });

        if (input.toLowerCase() === "features") {
          setCurrentMenu("help");
        }
      } else {
        simulateTyping("Sorry, I didn't understand that. Please select an option.", () => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "bot",
              text: "Sorry, I didn't understand that. Please select an option.",
            },
          ]);
        });
      }
    }

    // Handle help menu inputs
    else if (currentMenu === "help") {
      const selectedOption = helpMenuOptions.find(
        (option) => option.question.toLowerCase() === input.toLowerCase()
      );

      if (selectedOption) {
        simulateTyping(selectedOption.answer, () => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: selectedOption.answer },
          ]);
        });
      } else {
        simulateTyping("Sorry, I didn't understand that. Please select an option.", () => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "bot",
              text: "Sorry, I didn't understand that. Please select an option.",
            },
          ]);
        });
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    
    // Use GSAP to animate the expansion/collapse
    const chatElement = document.querySelector('.chat-container');
    if (chatElement) {
      gsap.to(chatElement, {
        width: isExpanded ? (isMobile ? '100%' : '400px') : (isMobile ? '100%' : '500px'),
        height: isExpanded ? '500px' : (isMobile ? '100vh' : '600px'),
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  };

  // Floating animation for avatar
  useEffect(() => {
    const avatar = document.querySelector('.bot-avatar');
    if (avatar) {
      gsap.to(avatar, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div 
    className={`chat-container bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 w-full max-w-3xl ${isMobile ? (isExpanded ? 'fixed inset-0 z-50' : 'w-full max-w-md') : 'w-full max-w-10xl'}`}
    style={{
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.5)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    }}
  >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center">
          <div className="bot-avatar mr-3 bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAwYzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJzLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyIDUuMzczLTEyIDEyLTEyem0wIDJjNS41MTQgMCAxMCA0LjQ4NiAxMCAxMHMtNC40ODYgMTAtMTAgMTAtMTAtNC40ODYtMTAtMTAgNC40ODYtMTAgMTAtMTB6bS0uNSA1Yy44MjkgMCAxLjUuNjcxIDEuNSAxLjVzLS42NzEgMS41LTEuNSAxLjUtMS41LS42NzEtMS41LTEuNS42NzEtMS41IDEuNS0xLjV6bTQuNSAxLjVjMC0uODI5LjY3MS0xLjUgMS41LTEuNXMxLjUuNjcxIDEuNSAxLjUtLjY3MSAxLjUtMS41IDEuNS0xLjUtLjY3MS0xLjUtMS41em0tOS41IDBjMC0uODI5LjY3MS0xLjUgMS41LTEuNXMxLjUuNjcxIDEuNSAxLjUtLjY3MSAxLjUtMS41IDEuNS0xLjUtLjY3MS0xLjUtMS41em01LjY4MSAzLjE0Yy4yNS4zMTMuMjUuNzg3IDAgMS4xbC0uOTY3IDEuMmMxLjE1LjQzNiAxLjk3NyAxLjU0NSAxLjk3NyAyLjg0OSAwIDEuNjgtMS4zNjEgMy4wNC0zLjAzOSAzLjA0MHMtMy4wMzktMS4zNi0zLjAzOS0zLjA0YzAtLjMwOS4yNTEtLjU2LjU2LS41NnMuNTYuMjUxLjU2LjU2YzAgMS4wNi44NTggMS45MiAxLjkxOSAxLjkyczEuOTE5LS44NTggMS45MTktMS45MmMwLS44ODMtLjU5NS0xLjYyOC0xLjQwNS0xLjg1MWwtMS4wODEgMS4zNGMtLjI1LjMxMy0uNzA1LjMxMy0uOTU1IDBsLTEuNzkxLTIuMjRjLS4yNS0uMzEzLS4yNS0uNzg3IDAtMS4xbDEuNzkxLTIuMjRjLjI1LS4zMTMuNzA1LS4zMTMuOTU1IDBsMS43OTEgMi4yNHoiIGZpbGw9IiMwMDdiZmYiLz48L3N2Zz4=" 
              alt="Bot Avatar"
              className="w-8 h-8"
            />
          </div>
          <h2 className="font-bold text-lg">TuteeTutor ChatBot</h2>
        </div>
        <div className="flex">
          <button 
            onClick={toggleExpand}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="h-[300px] overflow-y-auto p-4 bg-gray-50"
        style={{
          background: "rgba(245, 247, 250, 0.7)",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 transparent",
        }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>Ask me anything about TuteeTutor!</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            {message.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-blue-600 text-xs font-bold">TT</span>
              </div>
            )}
            <div
              className={`message-bubble px-4 py-2 rounded-xl max-w-[75%] ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 shadow-sm rounded-tl-none"
              }`}
              style={{
                boxShadow: message.sender === "user" 
                  ? "0 4px 6px rgba(0, 123, 255, 0.1)" 
                  : "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              <p>{message.text}</p>
            </div>
            {message.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
                <span className="text-white text-xs font-bold">YOU</span>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-blue-600 text-xs font-bold">TT</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl max-w-[75%] text-gray-800 shadow-sm rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick response buttons */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-t border-gray-200">
        {(currentMenu === "main" ? mainMenuOptions : helpMenuOptions).map(
          (option, index) => (
            <button
              key={index}
              onClick={() => handleMessage(option.question)}
              className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 text-sm transition-all duration-200 hover:shadow-md"
            >
              {option.question}
            </button>
          )
        )}

        {currentMenu !== "main" && (
          <button
            onClick={handleMainMenu}
            className="rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 text-sm transition-all duration-200 hover:shadow-md"
          >
            Back to Main Menu
          </button>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full overflow-hidden pr-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleMessage(userInput)}
            placeholder="Type a message..."
            className="flex-1 py-2 px-4 bg-transparent focus:outline-none"
          />
          <button
            onClick={() => handleMessage(userInput)}
            className="send-button ml-2 bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;