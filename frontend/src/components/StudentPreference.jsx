import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentPreference.css";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const StudentPreference = () => {
  const { user } = useOutletContext();
  const [courses, setCourses] = useState([]); // Store courses fetched from API
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedSections, setSelectedSections] = useState({});
  const [error, setError] = useState("");
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch courses dynamically from the backend API
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/course`
        );
        const data = await response.json();
        setCourses(data); // Store the fetched courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

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

  const selectedData = selectedCourses.map((course) => ({
    courseId: course,
    section: selectedSections[course],
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate if each course has a section selected
    for (const course of selectedCourses) {
      if (!selectedSections[course]) {
        setError(`Please select a section for ${course}.`);
        return;
      }
    }

    // Prepare the data to be saved
    const selectedData = selectedCourses.map((course) => ({
      courseId: course,
      section: selectedSections[course],
    }));

    try {
      console.log(selectedData);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}/courses`,
        { courses: selectedData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Preferences saved successfully");
        navigate("/"); // Navigate after successful submission
      } else {
        setError("Failed to save preferences.");
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      setError("An error occurred while submitting preferences.");
    }
  };

  return (
    <div className="student-preference-container">
      <div className="preference-card">
        <h2 className="preference-title">Select Your Preferences</h2>

        <form className="preference-form" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Registered Courses
            </label>
            <select
              multiple
              value={selectedCourses}
              onChange={handleCourseChange}
              className="course-select"
            >
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCourses.map((courseId) => {
            const course = courses.find((course) => course._id === courseId);
            return (
              <div key={courseId}>
                <label className="block text-gray-600 font-medium mb-2">
                  Section for {course.name}
                </label>
                <select
                  name={courseId}
                  value={selectedSections[courseId] || ""}
                  onChange={handleSectionChange}
                  className="section-select"
                >
                  <option value="">Select a section</option>
                  {course.sections &&
                    course.sections.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.section}
                      </option>
                    ))}
                </select>
              </div>
            );
          })}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Submit Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentPreference;
