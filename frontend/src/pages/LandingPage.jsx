import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  useEffect(() => {
    gsap.fromTo(
      ".navbar",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
    );

    // Hero Section Animations
    gsap.fromTo(
      ".hero-heading",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.5 }
    );

    gsap.fromTo(
      ".hero-subheading",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.8 }
    );

    gsap.fromTo(
      ".hero-btn",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "bounce.out", delay: 1.2 }
    );

    gsap.to(".hero-btn", {
      scale: 1.1,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feature-card",
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".pricing-card",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: ".pricing-card",
          start: "top 80%",
        },
      }
    );

    gsap.to(".scroll-text", {
      x: "-100%",
      duration: 20,
      ease: "linear",
      repeat: -1, // Repeat indefinitely
      modifiers: {
        x: function (x) {
          return (parseFloat(x) % 100) + "%";
        },
      },
    });
  }, []);

  return (
    <div className="bg-white text-blue-500 font-sans">
      {/* Navbar */}
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

      {/* Add padding to ensure the content is not hidden */}
      <div className="pt-20" style={{ height: "100vh" }}>
        <section className="relative h-screen flex items-center justify-center">
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 z-0">
            <div className="scroll-text text-blue-500 font-extrabold text-[500px] whitespace-nowrap">
              TUTEETUTOR &nbsp;&nbsp;&nbsp;&nbsp; TUTEETUTOR
              &nbsp;&nbsp;&nbsp;&nbsp; TUTEETUTOR &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          <div className="relative z-10">
            <img
              src="/images/image_1.png"
              alt="Hero Image"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Remaining sections */}
        <section className="relative h-screen flex items-center justify-between bg-blue-500 bg-center">
          {/* Text Section */}
          <div className="relative z-10 text-left text-white px-6 py-24 w-1/2 left-[10%]">
            <h1 className="text-6xl font-bold mb-4 hero-heading">
              Streamline Your Learning Journey
            </h1>
            <p className="text-2xl mb-6 hero-subheading">
              Tuteetutor brings educators and students together on a modern,
              intuitive platform.
            </p>
          </div>

          {/* Image Section */}
          <div className="relative w-1/3 h-full flex items-center justify-between">
            <img
              src="/images/tuteetutor.png"
              alt="Hero Image"
              className="absolute inset-0 w-1/2 h-auto object-cover top-[20%]" // Adjusted height to auto
            />
          </div>
        </section>

        <section className="relative h-screen flex items-center justify-between bg-cover bg-center">
          {/* Image Section */}
          <div className="relative w-1/3 h-full flex items-center justify-center left-[10%]">
            <img
              src="/images/image_2.png"
              alt="Hero Image"
              className="w-full h-auto object-cover" // Ensures the image scales properly
            />
          </div>

          {/* Text Section */}
          <div className="w-1/2 text-left text-blue-500 px-8">
            <h1 className="text-6xl font-bold hero-heading mb-4">
              Empower Your Education with Tuteetutor
            </h1>
            <p className="text-2xl hero-subheading">
              Our platform offers seamless communication, streamlined
              assignments, and personalized learning tools to ensure an
              engaging, productive experience.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
