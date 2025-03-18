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
  Input,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

function AnnouncementModel({ open, handleClose, user }) {
  const [mainAnnoumcement, setMainAnnouncement] = useState("");
  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarSecurity, setSnackbarSecurity] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      if (!open) return; // Only fetch when modal is open
      
      setFetchingCourses(true);
      setError(null);
      
      try {
        console.log('Fetching courses with user:', user);
        console.log('Token available:', !!token);
        
        const response = await axios.get(
          `${backendUrl}/announcements/faculty`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log('Courses response:', response);
        
        if (response.status === 200) {
          setCourses(response.data);
        } else {
          console.error("Failed to fetch courses:", response);
          setError("Failed to fetch courses. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(
          error?.response?.data?.message || 
          "An error occurred while fetching courses. Please check your connection and try again."
        );
      } finally {
        setFetchingCourses(false);
      }
    };

    fetchCourses();
  }, [open, user, token, backendUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !mainAnnoumcement || !title) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please fill all the required fields.");
      setSnackbarSecurity("warning");
      return;
    }

    setLoading(true);
    setError(null);

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("title", title);
    formData.append("description", mainAnnoumcement);
    
    // Use the user.id from props if available
    if (user && user.id) {
      formData.append("authorId", user.id);
    } else {
      console.error("No user ID available");
      setSnackbarOpen(true);
      setSnackbarMessage("User ID not found. Please log in again.");
      setSnackbarSecurity("error");
      setLoading(false);
      return;
    }
    
    // Append file if it exists
    if (file) {
      formData.append("file", file);
    }

    // Debug logs
    console.log("Submitting with user:", user);
    console.log("courseId:", selectedCourse);
    console.log("title:", title);
    console.log("File:", file ? file.name : "No file");

    try {
      const response = await axios.post(
        `${backendUrl}/announcements`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
      
      console.log("Announcement creation response:", response);
      
      if (response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage("Announcement created successfully.");
        setSnackbarSecurity("success");
        
        // Reset form fields
        setMainAnnouncement("");
        setTitle("");
        setSelectedCourse("");
        setFile(null);
        setFileName("");
        
        // Close modal after short delay
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to create announcement.");
        setSnackbarSecurity("error");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      console.error("Response:", error.response);
      
      setSnackbarOpen(true);
      setSnackbarMessage(
        error?.response?.data?.message ||
        "An error occurred while creating the announcement. Please try again."
      );
      setSnackbarSecurity("error");
      setError(error?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
    maxHeight: "90vh",
    overflow: "auto",
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
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Stack spacing={2}>
          {fetchingCourses ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Loading courses...
              </Typography>
            </Box>
          ) : (
            <TextField
              select
              label="Select Course"
              value={selectedCourse}
              onChange={handleCourseChange}
              fullWidth
              variant="outlined"
              required
              disabled={loading}
              error={courses.length === 0}
              helperText={courses.length === 0 ? "No courses available. Please check your permissions." : ""}
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
          )}
          
          {/* Title field */}
          <TextField
            id="announcement-title"
            label="Announcement Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Enter a descriptive title for your announcement."
          />
          
          {/* Main content field */}
          <TextField
            id="main-announcement"
            label="Main Announcement"
            variant="outlined"
            value={mainAnnoumcement}
            onChange={(e) => setMainAnnouncement(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            disabled={loading}
            helperText="Enter the main content of the announcement."
          />
          
          {/* File upload section */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Attachment (Optional)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                Upload File
                <Input
                  type="file"
                  sx={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </Button>
              
              {fileName && (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  bgcolor: "#f0f0f0", 
                  borderRadius: 1, 
                  px: 2, 
                  py: 1, 
                  maxWidth: "250px" 
                }}>
                  <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap" 
                    }}
                  >
                    {fileName}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={handleRemoveFile} 
                    sx={{ ml: 1 }}
                    disabled={loading}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Debug info in development environment */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                Debug Info:
                <br />
                User: {user ? `${user.name} (${user.id}, ${user.role})` : 'Not available'}
                <br />
                Token: {token ? `${token.substring(0, 15)}...` : 'Not available'}
                <br />
                Backend URL: {backendUrl}
              </Typography>
            </Box>
          )}
          
          {/* Action buttons */}
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
              disabled={loading || !selectedCourse || !title || !mainAnnoumcement}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AnnouncementModel;