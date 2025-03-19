import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  // Refs for animation targets
  const headerRef = useRef(null);
  const rolesRef = useRef(null);
  const featureCardsRef = useRef(null);
  
  useEffect(() => {
    // Navbar animation (similar to landing page)
    gsap.fromTo(
      ".navbar",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
    );

    // Header animations
    gsap.fromTo(
      ".features-heading",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.5 }
    );

    gsap.fromTo(
      ".features-subheading",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.8 }
    );

    // Role cards staggered animation
    gsap.fromTo(
      ".role-card",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".roles-section",
          start: "top 80%",
        },
      }
    );

    // Feature cards animations with different directions based on index
    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card, index) => {
      const isEven = index % 2 === 0;
      gsap.fromTo(
        card,
        { 
          x: isEven ? -50 : 50, 
          opacity: 0 
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );
    });

    // Animate icons within feature cards
    gsap.fromTo(
      ".feature-icon",
      { scale: 0, rotation: -15 },
      {
        scale: 1,
        rotation: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".feature-section",
          start: "top 80%",
        },
      }
    );

    // Animation for CTA section
    gsap.fromTo(
      ".cta-content",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 75%",
        },
      }
    );

    // Hover animations for feature cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          duration: 0.3
        });
        
        // Also animate the icon
        const icon = card.querySelector('.feature-icon');
        if (icon) {
          gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          duration: 0.3
        });
        
        // Reset icon animation
        const icon = card.querySelector('.feature-icon');
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3
          });
        }
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#61dafb" }} className="text-blue-500 font-sans min-h-screen">

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

      {/* Header Section */}
      <header className="pt-28 pb-16 px-4 bg-gradient-to-b from-blue-50 to-white" ref={headerRef}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="features-heading text-5xl md:text-6xl font-bold text-blue-600 mb-6">
            Powerful Features for Modern Education
          </h1>
          <p className="features-subheading text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Tuteetutor provides a comprehensive set of tools designed to enhance classroom management, 
            communication, and productivity for educational institutions.
          </p>
        </div>
      </header>

      {/* User Roles Section */}
      <section className="roles-section py-16 px-4 bg-white" ref={rolesRef}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">
            Tailored for Every Role
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Admin Role Card */}
            <div className="role-card bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white transform transition duration-300 hover:scale-105">
              <div className="h-16 w-16 bg-white text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Admin</h3>
              <p className="text-center text-blue-100">
                Complete system oversight, user management, and institutional settings.
              </p>
            </div>
            
            {/* HOD Role Card */}
            <div className="role-card bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-lg p-6 text-white transform transition duration-300 hover:scale-105">
              <div className="h-16 w-16 bg-white text-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">HOD</h3>
              <p className="text-center text-indigo-100">
                Department management, faculty oversight, and curriculum planning.
              </p>
            </div>
            
            {/* Faculty Role Card */}
            <div className="role-card bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white transform transition duration-300 hover:scale-105">
              <div className="h-16 w-16 bg-white text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Faculty</h3>
              <p className="text-center text-purple-100">
                Classroom management, assignment creation, and student assessment.
              </p>
            </div>
            
            {/* Student Role Card */}
            <div className="role-card bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl shadow-lg p-6 text-white transform transition duration-300 hover:scale-105">
              <div className="h-16 w-16 bg-white text-teal-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Student</h3>
              <p className="text-center text-teal-100">
                Assignment submission, timetable access, and communication with faculty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="feature-section w-full py-16 px-4 bg-gray-50" ref={featureCardsRef}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-8xl font-bold text-center text-blue-600 mb-12">
            Key Features
          </h2>
          
          <div className="space-y-12">
            {/* Leave Requests Feature */}
            <div className="feature-card bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center">
              <div className="feature-icon w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-3">Leave Management System</h3>
                <p className="text-gray-600 mb-4">
                  Students can easily submit leave requests through the platform, which are then 
                  automatically routed to the appropriate faculty or HOD for approval. 
                  The system keeps track of all requests and their statuses, allowing for 
                  better attendance management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Request Submission</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Approval Workflow</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Status Tracking</span>
                </div>
              </div>
            </div>
            
            {/* To-Do Lists Feature */}
            <div className="feature-card bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row-reverse items-center">
              <div className="feature-icon w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 md:mb-0 md:ml-8 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-600 mb-3">Personal To-Do Lists</h3>
                <p className="text-gray-600 mb-4">
                  Every user can manage their personal tasks with our intuitive to-do list feature.
                  Create, prioritize, and track completion of tasks, with options for deadlines, 
                  reminders, and task categorization to keep your work organized.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Task Creation</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Priority Levels</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Deadline Reminders</span>
                </div>
              </div>
            </div>
            
            {/* Notifications Feature */}
            <div className="feature-card bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center">
              <div className="feature-icon w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-600 mb-3">Smart Notifications</h3>
                <p className="text-gray-600 mb-4">
                  Never miss important updates with our comprehensive notification system. 
                  Users receive real-time alerts about announcements, assignment deadlines, 
                  grade postings, and system changes based on their role and preferences.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Real-time Alerts</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Role-based Filters</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Custom Preferences</span>
                </div>
              </div>
            </div>
            
            {/* Timetable Feature */}
            <div className="feature-card bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row-reverse items-center">
              <div className="feature-icon w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 md:mb-0 md:ml-8 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-teal-600 mb-3">Interactive Timetable</h3>
                <p className="text-gray-600 mb-4">
                  View your class schedule at a glance with our intuitive timetable interface.
                  Students and faculty can easily track their next class information, including
                  location, subject, and timing, with intelligent reminders and easy navigation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">Visual Schedule</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">Next Class Alert</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">Location Details</span>
                </div>
              </div>
            </div>
            
            {/* Holiday Calendar Feature */}
            <div className="feature-card bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center">
              <div className="feature-icon w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-600 mb-3">Holiday Calendar</h3>
                <p className="text-gray-600 mb-4">
                  Stay informed about upcoming holidays and important academic dates.
                  Our calendar system highlights holidays, exam periods, and other 
                  significant events, ensuring everyone can plan ahead effectively.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Visual Calendar</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Event Reminders</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Academic Planning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="cta-section py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto text-center cta-content">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Educational Experience?</h2>
          <p className="text-xl mb-10">
            Join thousands of educational institutions already using Tuteetutor to streamline their classroom management.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {window.location.href = "/login";}} 
              className="hero-btn bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300"
            >
              Get Started
            </button>
            <button 
              onClick={() => {window.location.href = "/demo";}} 
              className="hero-btn bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>
      
      
    </div>
  );
};

export default Features;