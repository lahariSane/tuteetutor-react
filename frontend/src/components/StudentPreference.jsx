import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentPreference = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedSections, setSelectedSections] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const courses = ["Mathematics", "Physics", "Computer Science", "Biology"];
  const sections = ["A", "B", "C", "D"];

  const handleCourseChange = (event) => {
    const { value } = event.target;
    setSelectedCourses((prev) => {
      if (prev.includes(value)) {
        return prev.filter((course) => course !== value); // Remove if already selected
      } else {
        return [...prev, value]; // Add new course
      }
    });
  };

  const handleSectionChange = (event) => {
    const { value, name } = event.target;

    if (selectedSections[name] && selectedSections[name] === value) {
      setError(`You cannot select multiple sections for the same course.`);
      return;
    }

    setSelectedSections((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate if each course has a section selected
    for (const course of selectedCourses) {
      if (!selectedSections[course]) {
        setError(`Please select a section for ${course}.`);
        return;
      }
    }

    console.log("Selected Courses:", selectedCourses);
    console.log("Selected Sections:", selectedSections);

    // Navigate to the home page after submission
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Select Your Preferences
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">
              Registered Courses
            </label>
            <select
              multiple
              value={selectedCourses}
              onChange={handleCourseChange}
              className="w-full h-32 px-4 py-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {selectedCourses.map((course) => (
            <div key={course} className="mb-6">
              <label className="block text-gray-600 font-medium mb-2">
                Section for {course}
              </label>
              <select
                name={course}
                value={selectedSections[course] || ""}
                onChange={handleSectionChange}
                className="w-full px-4 py-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a section</option>
                {sections.map((section, index) => (
                  <option key={index} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold text-lg"
          >
            Submit Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentPreference;
