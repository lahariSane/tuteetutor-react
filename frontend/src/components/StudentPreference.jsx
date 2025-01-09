import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentPreference.css";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const StudentPreference = () => {
  const { user } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [selectedSections, setSelectedSections] = useState({});
  const [error, setError] = useState("");
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/course`
        );
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSectionChange = (event, courseId) => {
    const { value } = event.target;
    setSelectedSections((prev) => ({
      ...prev,
      [courseId]: value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedData = Object.keys(selectedSections).map((courseId) => ({
      courseId,
      section: selectedSections[courseId],
    }));

    if (selectedData.length === 0) {
      setError("Please select at least one course and its section.");
      return;
    }

    try {
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
        navigate("/");
      } else {
        setError("Failed to save preferences.");
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      setError("An error occurred while submitting preferences.");
    }
  };

  return (
      <div className="preference-card">
        <h2 className="preference-title">Select Your Preferences</h2>
        <form className="preference-form" onSubmit={handleSubmit}>
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-item">
                <h3 className="course-name">{course.name}</h3>
                <select
                  value={selectedSections[course._id] || ""}
                  onChange={(e) => handleSectionChange(e, course._id)}
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
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Submit Preferences
          </button>
        </form>
      </div>
  );
};

export default StudentPreference;
