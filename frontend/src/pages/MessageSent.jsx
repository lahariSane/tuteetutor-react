import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import gsap from "gsap";

const MessageSent = () => {
  useEffect(() => {
    // Create animation timeline
    const tl = gsap.timeline();
    
    // Animate the success container
    tl.from(".success-container", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
    
    // Animate the success icon
    tl.from(".success-icon", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.3");
    
    // Animate the text elements
    tl.from(".success-text", {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.4
    }, "-=0.2");
    
    // Animate the button
    tl.from(".home-button", {
      y: 20,
      opacity: 0,
      duration: 0.4
    }, "-=0.1");
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-md w-full text-center success-container">
        <div className="text-green-500 success-icon mb-6">
          <CheckCircleIcon style={{ fontSize: 80 }} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4 success-text">
          Message Sent Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8 success-text">
          Thank you for reaching out to us. We've received your message and will get back to you as soon as possible, usually within 24-48 hours during business days.
        </p>
        
        <Link 
          to="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 home-button"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default MessageSent;