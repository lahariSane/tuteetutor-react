import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

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

function AnnouncementModel({ open, handleClose }) {
  const [attachedFile, setAttachedFile] = useState(null);

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={style}>
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

          {/* File Attachment Section */}
          <div>
            <label
              htmlFor="file"
              className="block text-gray-700 flex items-center cursor-pointer"
            >
              <AttachFileIcon className="mr-2" />
              <span className="text-blue-600 hover:underline">
                Attach a file
              </span>
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {attachedFile && (
              <div className="mt-2 flex items-center space-x-2 border border-gray-300 rounded-lg p-2">
                <Typography variant="body2" color="textSecondary" flexGrow={1}>
                  {attachedFile.name}
                </Typography>
                <IconButton onClick={removeFile} color="error">
                  <DeleteIcon />
                </IconButton>
              </div>
            )}
          </div>

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
