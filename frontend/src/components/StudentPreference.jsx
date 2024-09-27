import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentPreference = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const navigate = useNavigate()

  const courses = ["Mathematics", "Physics", "Computer Science", "Biology"];
  const sections = ["A", "B", "C", "D"];

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/')
    console.log("Selected Course:", selectedCourse);
    console.log("Selected Section:", selectedSection);
  
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Select Your Preferences
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">
              Registered Course
            </label>
            <select
              value={selectedCourse}
              onChange={handleCourseChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select a course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Section</label>
            <select
              value={selectedSection}
              onChange={handleSectionChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select a section</option>
              {sections.map((section, index) => (
                <option key={index} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentPreference;
