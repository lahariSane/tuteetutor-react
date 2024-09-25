import React from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

function AnnouncementModel({ open, handleClose }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={style}>
                <Typography id="parent-modal-title" variant="h6" component="h2" gutterBottom>
                    Create Announcement
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        id="brief-announcement"
                        label="Brief Announcement"
                        variant="outlined"
                        fullWidth
                        required
                        helperText="Enter a brief headline for the announcement."
                    />
                    <TextField
                        id="main-announcement"
                        label="Main Announcement"
                        variant="outlined"
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
                        <Button variant="contained" color="primary">
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
}

export default AnnouncementModel;
