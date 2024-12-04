import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,

  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

function AnnouncementModel({ open, handleClose, user }) {
  const [mainAnnoumcement, setMainAnnouncement] = useState("");
  const [courses, setCourses] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarSecurity, setSnackbarSecurity] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const token = localStorage.getItem("token");
  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/announcements/faculty`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setCourses(response?.data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCourse || !mainAnnoumcement) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please fill all the fields.");
      setSnackbarSecurity("warning");
      return;
    }
    let response = null;
    try {
      response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/announcements`,
        {
          courseId: selectedCourse,
          description: mainAnnoumcement,
          authorId: user.id,
        },
        {headers: {
          Authorization: `Bearer ${token}`,
        }}
      );
      if (response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage("Announcement created successfully.");
        setSnackbarSecurity("success");
        setMainAnnouncement("");
        setSnackbarOpen(false);
        handleClose();
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to create announcement.");
        setSnackbarSecurity("error");
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage(
        error?.response?.data?.message ||
          "An error occurred while creating the announcement."
      );
      setSnackbarSecurity("error");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={style}>
        <Snackbar
          sx={{ position: "static", marginBottom: "20px" }}
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSecurity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Typography
          id="parent-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Create Announcement
        </Typography>
        <Stack spacing={2}>
          <TextField
            select
            label="Select Course"
            value={selectedCourse}
            onChange={handleCourseChange}
            fullWidth
            variant="outlined"
            required
          >
            {courses.length > 0 ? (
              courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name} - {course.section}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No courses available</MenuItem>
            )}
          </TextField>
          <TextField
            id="main-announcement"
            label="Main Announcement"
            variant="outlined"
            vale={mainAnnoumcement}
            onChange={(e) => setMainAnnouncement(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            helperText="Enter the main content of the announcement."
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AnnouncementModel;
