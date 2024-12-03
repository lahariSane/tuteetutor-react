import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  MenuItem,
  Alert,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function AddFacultyModel({ open, handleClose, handleAdd }) {
  const [FacultyEmail, setFacultyEmail] = useState("");
  const [Section, setSection] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem("token");
  
  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/hod-course`,
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

  // Fetch suggestions when the modal opens
  useEffect(() => {
    if (open) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/users`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setSuggestions(response?.data?.map((user) => user.email) || []);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error.message);
        }
      };

      fetchSuggestions();
    }
  }, [open]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSubmit = async () => {
    if (!FacultyEmail || !Section || !selectedCourse) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please fill all the fields.");
      setSnackbarSeverity("warning");
      return;
    }
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/faculty`,
        {
          facultyEmail: FacultyEmail,
          courseId: selectedCourse,
          section: Section,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setSnackbarMessage("Faculty Added successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleAdd();
        setFacultyEmail("");
        setSection("");
        setSelectedCourse("");
        handleClose();
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage(
        error?.response?.data?.message ||
          "An error occurred while adding Faculty."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Set loading to false
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
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
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
            severity={snackbarSeverity}
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
          Add Faculty
        </Typography>
        <Stack spacing={2}>
          <Autocomplete
            freeSolo
            options={suggestions}
            value={FacultyEmail}
            onInputChange={(event, value) => setFacultyEmail(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Faculty Email"
                variant="outlined"
                fullWidth
                required
              />
            )}
          />
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
                  {course.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No courses available</MenuItem>
            )}
          </TextField>
          <TextField
            label="Section"
            variant="outlined"
            value={Section}
            onChange={(e) => setSection(e.target.value)}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddFacultyModel;
