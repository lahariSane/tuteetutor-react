import React from "react";
import "../styles/Faculty.css";
import { useOutletContext } from "react-router-dom";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import AddFacultyModel from "./AddFacultyModel";

const FacultyCard = ({ faculty }) => {
  return (
    <div className="faculty-container">
      <div className="faculty-card">
        <div className="faculty-photo">
          <img src={faculty.photo} alt={faculty.name} />
        </div>
        <div className="faculty-details">
          <h3>{faculty.name}</h3>
          <p>CSE</p>
          <p>
            {faculty.subject} - {faculty.section}
          </p>
        </div>
        <button className="remove-button">
          <i className="fas fa-trash-alt"></i> Remove
        </button>
      </div>
    </div>
  );
};

const FacultyList = () => {
  const facultyList = [
    {
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "Dr. John Doe",
      subject: "FFSD",
      section: "A",
    },
    {
      photo: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Dr. John Doe",
      subject: "FFSD",
      section: "A",
    },
    {
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "Dr. John Doe",
      subject: "FFSD",
      section: "A",
    },
    {
      photo: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Dr. John Doe",
      subject: "FFSD",
      section: "A",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/4.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/5.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/6.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/7.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/8.jpg",
      name: "Prof. Jane Smith",
      subject: "DSA",
      section: "B",
    },
    // Add more faculty objects as needed
  ];

  const data = useOutletContext();
  const drawerWidth = data.drawerWidth;

  const [modal, setModal] = React.useState(false);
  const handleModalOpen = () => setModal(true);
  const handleModalClose = () => setModal(false);
  return (
    <>
      <AddFacultyModel
        open={modal}
        handleClose={handleModalClose}
        // user={user}
      />
      <Box
        className="faculty-list"
        sx={{
          width: `calc(100vw - ${drawerWidth}px - 10px)`,
          left: drawerWidth,
          top: "64px",
          position: "absolute",
          height: "calc(100% - 60px)",
        }}
      >
        {facultyList.map((faculty, index) => (
          <FacultyCard key={index} faculty={faculty} />
        ))}
      </Box>
      <Fab
        onClick={handleModalOpen}
        color="primary"
        variant="extended"
        aria-label="add"
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: "20px",
          right: "20px",
        }}
      >
        <AddIcon sx={{ marginRight: "6px" }} />
        Add Faculty
      </Fab>
    </>
  );
};

export default FacultyList;
