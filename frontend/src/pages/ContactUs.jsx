import React, { useState, useEffect, useRef } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Link } from "react-router-dom";

const ContactUs = () => {
  // State management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Refs for GSAP animations
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const contactInfoRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    console.log("Form data submitted:", formData); // Log the data being submitted

    try {
      // Make sure API endpoint matches your backend route
      const response = await axios.post("http://localhost:5000/api/contact/submit", formData);
      
      if (response.data.message === "Message sent successfully.") {
        // Success animation before redirect
        gsap.to(formRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.5,
          onComplete: () => navigate("/message-sent")
        });
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      
      // Provide more specific error messages from the backend if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong! Please try again later.");
      }
      
      setIsSubmitting(false);
      
      // Error shake animation
      gsap.to(formRef.current, {
        x: [-10, 10, -8, 8, -5, 5, 0],
        duration: 0.6,
        ease: "power1.inOut"
      });
    }
  };
  
  // Initialize animations
  useEffect(() => {
    // Page entrance animation timeline
    const tl = gsap.timeline();
    
    // Navbar animation
    tl.from("nav", {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    // Header animation
    tl.from(headerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.7
    }, "-=0.3");
    
    // Contact info section animation
    tl.from(contactInfoRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.7
    }, "-=0.4");
    
    // Form section animation
    tl.from(formRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.7
    }, "-=0.6");
    
    // Form fields animation
    tl.from(".form-field", {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.5
    }, "-=0.4");
    
    // Floating animation for contact info icons
    gsap.to(".contact-icon", {
      y: -6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3
    });
    
    // Social icons hover animation
    document.querySelectorAll(".social-icon").forEach(icon => {
      icon.addEventListener("mouseenter", () => {
        gsap.to(icon, {
          scale: 1.2,
          duration: 0.3
        });
      });
      
      icon.addEventListener("mouseleave", () => {
        gsap.to(icon, {
          scale: 1,
          duration: 0.3
        });
      });
    });
    
    // Cleanup event listeners on unmount
    return () => {
      document.querySelectorAll(".social-icon").forEach(icon => {
        icon.removeEventListener("mouseenter", () => {});
        icon.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <div className="bg-blue-50 w-full">
       {/* Navbar - Same as Landing Page for consistency */}
            <nav className="navbar fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center p-4 bg-white shadow-md rounded-lg h-16">
              <div className="text-xl font-bold">tuteetutor</div>
              <div className="flex flex-row space-x-7">
                <Link
                  to="/"
                  className="cursor-pointer text-lg text-gray-600 hover:text-blue-700 hover:scale-110 transition duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="cursor-pointer text-lg text-blue-700 font-semibold hover:scale-110 transition duration-300"
                >
                  Features
                </Link>
                <Link
                  to="/contact-us"
                  className="cursor-pointer text-lg text-gray-600 hover:text-blue-700 hover:scale-110 transition duration-300"
                >
                  Contact Us
                </Link>
              </div>
              <div className="flex flex-row space-x-6">
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Sign Up
                </button>
              </div>
            </nav>

      {/* Main Section */}
      <div className="text-gray-700 left-0 w-full z-50">
        <div className="container mx-auto py-16 px-4 flex-col overflow-y-auto">
          {/* Contact Us Heading */}
          <div ref={headerRef} className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold">
              Contact <span className="text-blue-600">Us</span>
            </h1>
            
          </div>

          {/* Contact Sections */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
            {/* Get In Touch Section */}
            <div 
              ref={contactInfoRef}
              className="bg-blue-600 shadow-xl rounded-xl p-8 w-full lg:w-1/2 relative overflow-hidden"
            >
              {/* Background decoration elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500 rounded-full -ml-20 -mb-20 opacity-50"></div>
              
              <div className="relative z-10">
                <h1 className="text-4xl text-white font-bold mb-6">
                  Get In Touch
                </h1>
                <p className="text-white mb-8 text-xl">
                  Reach out to us for any general queries
                </p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 contact-icon">
                    <div className="bg-white/20 p-3 rounded-full">
                      <LocationOnIcon className="text-white" />
                    </div>
                    <span>
                      <p className="text-white text-xl">
                        London Eye, London, UK
                      </p>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 contact-icon">
                    <div className="bg-white/20 p-3 rounded-full">
                      <LocalPhoneIcon className="text-white" />
                    </div>
                    <span>
                      <p className="text-white text-xl">+123-456-7890</p>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 contact-icon">
                    <div className="bg-white/20 p-3 rounded-full">
                      <EmailIcon className="text-white" />
                    </div>
                    <span>
                      <p className="text-white text-xl">mail@tuteetutor.com</p>
                    </span>
                  </div>
                </div>
                <div className="mt-10 space-y-3">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Follow Us:
                  </h1>
                  <p className="text-white/90">
                    Stay connected and follow us on our social media channels for
                    the latest updates, tips, and resources:
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="social-icon bg-white/20 p-2 rounded-full transition-all duration-300">
                      <FacebookIcon fontSize="large" className="text-white" />
                    </a>
                    <a href="#" className="social-icon bg-white/20 p-2 rounded-full transition-all duration-300">
                      <TwitterIcon fontSize="large" className="text-white" />
                    </a>
                    <a href="#" className="social-icon bg-white/20 p-2 rounded-full transition-all duration-300">
                      <InstagramIcon fontSize="large" className="text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Send a Message Section */}
            <div 
              ref={formRef}
              className="bg-white shadow-xl rounded-xl p-8 w-full lg:w-1/2"
            >
              <h1 className="text-4xl text-blue-600 font-bold mb-8">
                Send a Message
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative z-0 w-full group form-field">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block py-3 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Name
                  </label>
                </div>
                <div className="relative z-0 w-full group form-field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block py-3 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative z-0 w-full group form-field">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="block py-3 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Message
                  </label>
                </div>
                {error && (
                  <div className="text-red-500 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 bg-blue-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-300 hover:shadow-lg w-full"
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                  {!isSubmitting && <SendIcon className="ml-2" />}
                </button>
              </form>
            </div>
          </div>
          
     
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8 text-center mt-16">
        <p className="text-lg">
          &copy; {new Date().getFullYear()} TuteeTutor. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactUs;