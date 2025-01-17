import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data submitted:", formData); // Log the data being submitted

    try {
      const response = await axios.post("/api/contact/submit", formData);
      if (response.data.message === "Message sent successfully.") {
        navigate("/message-sent");
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <nav className="navbar fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center p-4 bg-white shadow-md rounded-lg h-16">
        <div className="text-xl font-bold">tuteetutor</div>
        <div className="flex flex-row space-x-7">
          <a
            href="/"
            className="cursor-pointer text-lg text-gray-600 hover:text-blue-700 hover:scale-110 transition duration-300"
          >
            Home
          </a>

          <a
            href="/contact-us"
            className="cursor-pointer text-lg text-gray-600 hover:text-blue-700 hover:scale-110 transition duration-300"
          >
            Contact Us
          </a>
        </div>
        <div className="flex flex-row space-x-6">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <div className="pt-10 text-gray-700 mt-[60%] mx-auto">
        <div className="container mx-auto py-16 px-4 flex-col overflow-y-auto">
          {/* Contact Us Heading */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-500">
              We’re here to help! Whether you have a question, need support, or
              just want to share your feedback, we’d love to hear from you. Our
              team is dedicated to providing the best experience for both tutors
              and students on TuteeTutor.
            </p>
          </div>

          {/* Contact Sections */}
          <div className="flex flex-col lg:flex-row justify-between">
            {/* Get In Touch Section */}
            <div className="bg-blue-500 shadow-lg rounded-lg p-8 w-full lg:w-1/2">
              <h1 className="text-5xl text-white font-bold mb-6">
                Get In Touch
              </h1>
              <p className="text-white mb-6 text-2xl">
                Reach out to us for any general queries
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <LocationOnIcon />
                  <span>
                    <p className="text-white text-2xl">
                      London Eye, London, UK
                    </p>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <LocalPhoneIcon />
                  <span>
                    <p className="text-white text-2xl">+123-456-7890</p>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <EmailIcon />
                  <span>
                    <p className="text-white text-2xl">mail@tuteetutor.com</p>
                  </span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Follow Us:
                </h1>
                <p className="text-white">
                  Stay connected and follow us on our social media channels for
                  the latest updates, tips, and resources:
                </p>
                <div className="flex space-x-4">
                  <FacebookIcon fontSize="large" />
                  <TwitterIcon fontSize="large" />
                  <InstagramIcon fontSize="large" />
                </div>
              </div>
            </div>

            {/* Send a Message Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-full lg:w-1/2">
              <h1 className="text-5xl text-blue-500 font-bold mb-0">
                Send a Message
              </h1>
              <form onSubmit={handleSubmit} className="h-[60%] pt-20">
                <div className="relative z-0 w-full group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
                <div className="relative z-0 w-full group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-2xl text-gray-900 bg-transparent border-b-black-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
                <div className="relative z-0 w-full group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="block py-2.5 px-0 w-full text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
                {error && <div className="text-red-500">{error}</div>}
                <button
                  type="submit"
                  className="bg-blue-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} TuteeTutor. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactUs;
