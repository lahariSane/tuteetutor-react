import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from 'react-router-dom';
import '../styles/Settings.css';


export default function Profile() {
    const { user } = useOutletContext();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', role: '' });
    const [userCourses, setUserCourses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100'); // Default image URL
    const userId = user?.id;
    const [bio, setBio] = useState('');

    // Fetch courses on load
    useEffect(() => {
        const fetchUserCourseData = async () => {
            try {
                // Fetch all available courses
                const coursesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/course`);
                setCourses(coursesResponse.data);

                // Fetch user's registered courses
                const userCourseResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-course/${userId}`);
                if (userCourseResponse.data) {
                    setUserCourses(userCourseResponse.data.courseRegistered || []);
                }

                const personalInfoResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`);
                setPersonalInfo({
                    name: personalInfoResponse.data.name,
                    email: personalInfoResponse.data.email,
                    role: personalInfoResponse.data.role,
                });
                setBio(personalInfoResponse.data.bio || '');
                setProfileImage(personalInfoResponse.data.profileImage || 'https://via.placeholder.com/100');
            } catch (error) {
                console.error('Error fetching user course data:', error);
            }
        };

        if (userId) {
            fetchUserCourseData();
        }
    }, [userId]);

    const handleAddCourse = async () => {
        if (selectedCourse) {
            try {
                // Send request to add the selected course to the user's courses
                const response = await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/user-course/${userId}`,
                    {
                        courseId: selectedCourse,
                    }
                );

                setUserCourses(response.data.courseRegistered);  // Update state with the new courses
                setSelectedCourse('');  // Reset selected course
                alert('Course added successfully!');
            } catch (error) {
                console.error('Error adding course:', error);
                alert('Failed to add course');
            }
        }
    };

    // Handle Remove Course
    const handleRemoveCourse = async (courseId) => {
        try {
            // Send request to remove the course from the user's courses
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/user-course/${userId}`,
                {
                    data: { courseId },
                }
            );

            setUserCourses(response.data.courseRegistered);  // Update state with the new courses
            alert('Course removed successfully!');
        } catch (error) {
            console.error('Error removing course:', error);
            alert('Failed to remove course');
        }
    };

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSavePersonalInfo = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`,
                { name: personalInfo.name, email: personalInfo.email }
            );
            alert('Personal information updated successfully!');
            setIsEditing(false); // Exit editing mode after saving
        } catch (error) {
            console.error('Error saving personal information:', error);
            alert('Failed to save changes');
        }
    };

    const handleSaveBio = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}/bio`, { bio });
            alert('Bio updated successfully!');
        } catch (error) {
            console.error('Error saving bio:', error);
            alert('Failed to save bio');
        }
    };

    const handleUploadProfileImage = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfileImage(response.data.profileImage); // Update the profile image
            alert('Profile image updated successfully!');
        } catch (error) {
            console.error('Error uploading profile image:', error);
            alert('Failed to upload profile image');
        }
    };


    return (
        <div className='outer-container'>
            <div className='inner-container-1' >
                <div className='box-1'>
                    <div className="profile-container">
                        <div className="header">
                            <div class="edit-icon">✏️</div>
                        </div>
                        <div className="profile-content">
                            <div className="profile-photo">
                                <img className='profile-picture' src={profileImage} alt="Profile Photo" />
                            </div>
                            <div style={{ position: 'relative', top: "-3em" }}>
                                <h2 style={{ marginBottom: '0.3em', fontSize: '20px', margin: 0 }}>Your Photo</h2>
                                <p style={{ color: '#555', fontSize: '14px', margin: '5px 0 20px' }}>This will be displayed on your profile</p>
                            </div>
                            <div className="buttons">
                                <button className="upload-button">Upload New</button>
                                <button className="save-button">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='box-2'>
                    <div className="personal-info">
                        <div style={{ borderBottom: '2px solid #007bff' }}>
                            <h2 style={{ marginBottom: '0.3em', fontSize: '20px', margin: 0, marginBottom: '20px', color: '#333' }} > <b> Personal Information</b></h2>
                        </div>
                        <form className="personal-info-form" style={{ marginTop: '1em' }}>
                            <div className="form-group">
                                <label htmlFor="fullName"><b>Full Name</b></label>
                                <div className="input-wrapper">
                                    <span className="icon">👤</span>
                                    <input className='profile-input' type="text" id="fullName" name="name" placeholder="Full Name" value={personalInfo.name} onChange={handlePersonalInfoChange} disabled={!isEditing} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email"> <b> Email address</b></label>
                                <div className="input-wrapper">
                                    <span className="icon">📧</span>
                                    <input className='profile-input' type="email" id="email" name="email" placeholder="Email" value={personalInfo.email} onChange={handlePersonalInfoChange} disabled={!isEditing} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="role"><b>Role</b></label>
                                <div className="input-wrapper">
                                    <input className='profile-input' style={{ width: "35em" }} type="text" id="role" placeholder="Role" value={personalInfo.role} onChange={handlePersonalInfoChange} disabled />
                                </div>
                            </div>
                            {isEditing ? (
                                <button
                                    type="button"
                                    className="save-button"
                                    onClick={handleSavePersonalInfo}
                                    style={{ marginLeft: '15em' }}
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="upload-button"
                                    onClick={() => setIsEditing(true)}
                                    style={{ marginLeft: '15em' }}
                                >
                                    Update
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <div className="inner-container-2">
                <div className='box-3'>
                    <div className="bio">
                        <div style={{ borderBottom: '2px solid white' }}>
                            <h2 style={{ marginBottom: '0.3em', color: 'white', fontSize: '20px', margin: 0 }} > <b> Bio</b></h2>
                        </div>
                        <div className="bio-content">
                            <textarea width="40em" id="bio" placeholder="Write something about yourself..." rows="2" cols="55" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSaveBio}
                                style={{ marginLeft: '32em', marginTop: '4em' }}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
                <div className="box-4">
                    <div class="edit-courses-section">
                        <div style={{ borderBottom: '2px solid #007bff' }}>
                            <h2 style={{ marginBottom: '0.3em', fontSize: '20px', margin: 0, marginBottom: '20px', color: '#333' }} > <b> Edit Your Courses and Section</b></h2>
                        </div>
                        <form className="edit-info-form">
                            <div class="form-group">
                                <label className='edit-label' for="courses"> <b>Courses:</b></label>
                                <select id="courses" name="courses" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                    <option value="">Select a Course</option>
                                    {courses.map((course) => (
                                        // Map over courses and their sections
                                        course.sections.map((section) => (
                                            <option key={section._id} value={section._id}>
                                                {course.name} - {section.section}
                                            </option>
                                        ))
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                className="btn-add"
                                style={{
                                    padding: "8px 15px",
                                    marginTop: '2.5em',
                                    borderRadius: "5px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    height: '3em'
                                }}
                                onClick={handleAddCourse}
                                disabled={!selectedCourse}
                            >
                                Add Course
                            </button>
                        </form>
                        <div className="selected-courses">
                            <h3>Your Selected Courses:</h3>
                            <ul>
                                {userCourses.map((course) => (
                                    <li key={course._id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                        <span style={{ flexGrow: 1 }}>{course.code}-{course.section}</span>
                                        <span
                                            style={{
                                                cursor: "pointer",
                                                color: "red",
                                                fontSize: "1.2em",
                                                marginLeft: "10px",
                                                fontWeight: "bold",
                                            }}
                                            onClick={() => handleRemoveCourse(course._id)}
                                        >
                                            ✖️
                                        </span>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >



    )
}
