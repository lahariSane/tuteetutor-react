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
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function AddUserModal({ open, handleClose, handleUpdate, userData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setRole(userData.role || "");
    } else {
      setName("");
      setEmail("");
      setRole("");
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!name || !email || !role) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please fill all the fields.");
      setSnackbarSeverity("warning");
      return;
    }
    setLoading(true);
    try {
      let response;
      if (userData) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/${userData._id}`,
          { name, email, role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/user`,
          { name, email, role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage(
          userData ? "User updated successfully" : "User added successfully"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleUpdate();
        handleClose();
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage(
        error?.response?.data?.message || "An error occurred while processing."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Typography variant="h6" gutterBottom>
          {userData ? "Edit User" : "Add User"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            variant="outlined"
            required
          >
            <MenuItem value="hod">HOD</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </TextField>
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
              {loading ? "Submitting..." : userData ? "Update" : "Submit"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddUserModal;
