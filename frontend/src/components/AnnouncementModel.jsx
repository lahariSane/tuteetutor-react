import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function AnnouncementModel({ open, handleClose, user }) {
    const [breifAnnouncement, setBreifAnnouncement] = useState('');
    const [mainAnnoumcement, setMainAnnouncement] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState(null);
    const [snackbarSecurity, setSnackbarSecurity] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSubmit = async () => {
        if (!breifAnnouncement || !mainAnnoumcement) {
            setSnackbarOpen(true);
            setSnackbarMessage("Please fill all the fields.");
            setSnackbarSecurity("warning");
            return;
        }
        let response = null;
        try {
            response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/announcements`, {
                title: breifAnnouncement,
                description: mainAnnoumcement,
                authorId: user.id
            });
            if (response.status === 201) {
                setSnackbarOpen(true);
                setSnackbarMessage("Announcement created successfully.");
                setSnackbarSecurity("success");
                setBreifAnnouncement("");
                setMainAnnouncement("");
                handleClose();
            } else {
                setSnackbarOpen(true);
                setSnackbarMessage("Failed to create announcement.");
                setSnackbarSecurity("error");
            }
        } catch (error) {
            setSnackbarOpen(true);
            setSnackbarMessage(error?.response?.data?.message || "An error occurred while creating the announcement.");
            setSnackbarSecurity("error");
        }
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        borderRadius: '8px',
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
                    sx={{ position: 'static', marginBottom: '20px' }}
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSecurity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>

                </Snackbar>
                <Typography id="parent-modal-title" variant="h6" component="h2" gutterBottom>
                    Create Announcement
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        id="brief-announcement"
                        label="Brief Announcement"
                        variant="outlined"
                        value={breifAnnouncement}
                        onChange={(e) => setBreifAnnouncement(e.target.value)}
                        fullWidth
                        required
                        helperText="Enter a brief headline for the announcement."
                    />
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
