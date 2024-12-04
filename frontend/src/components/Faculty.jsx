import React, { useEffect, useCallback } from "react";
import "../styles/Faculty.css";
import { useOutletContext } from "react-router-dom";
import { Box, createTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import AddFacultyModel from "./AddFacultyModel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import HodList from "./Hod";

function stringToColor(string) {
  if (!string) {
    return "#007bff"; // Default to the base color
  }
  let hash = 0;

  // Generate a hash from the string
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  // Generate RGB values
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    // Blend with white to ensure lighter shades
    const blendedValue = Math.floor((value + 255) / 1.5); // Average with white (255)
    color += `00${blendedValue.toString(16)}`.slice(-2);
  }

  return color;
}

const FacultyCard = ({ faculty, user, token, onFacultyRemove }) => {
  const instructor = faculty.instructor;
  const handleClick = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/faculty/${instructor._id}/course/${faculty._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        onFacultyRemove(faculty._id); // Notify parent to update the list
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };
  return (
    <div className="faculty-container">
      <Box
        className="faculty-card"
        sx={{ height: user.role !== "hod" ? "250px" : "300px" }}
      >
        <div className="faculty-photo">
          <Avatar
            src={instructor?.profileImage}
            sx={{
              width: "100px",
              height: "100px",
              fontSize: "25px",
              fontWeight: "bold",
              position: "relative",
              top: "-50px",
              objectFit: "cover",
              bgcolor: stringToColor(instructor?.name),
            }}
            children={`${instructor?.name[0]}`}
          />
        </div>
        <div className="faculty-details">
          <h3>{instructor.name}</h3>
          <p className="email">{instructor.email}</p>
          <p>
            {faculty.code} - {faculty.section}
          </p>
          <p>{faculty.department}</p>
        </div>
        {user && user.role === "hod" && (
          <button className="remove-button" onClick={handleClick}>
            <i className="fas fa-trash-alt"></i> Remove
          </button>
        )}
      </Box>
    </div>
  );
};

const FacultyList = () => {
  const theme = createTheme({ breakpoints: { values: { sm: 700, md: 1380 } } });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [facultyList, setFacultyList] = React.useState([]);
  const fetchFaculty = useCallback(async () => {
    try {
      const res = await axios("http://localhost:5000/get-faculty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (
        res?.data?.message &&
        res?.data?.message === "No registered courses found for the student."
      ) {
        navigate("/coursesSelection");
        return;
      }
      if (
        res?.data?.message &&
        res?.data?.message === "No registered courses found for the faculty."
      ) {
        navigate("/");
        return;
      }
      setFacultyList(res.data);
    } catch (error) {
      console.error("Error fetching faculty list:", error);
    }
  }, [token, navigate]);
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const data = useOutletContext();
  const user = data.user;
  const drawerWidth = data.drawerWidth;
  const [modal, setModal] = React.useState(false);
  const handleModalOpen = () => setModal(true);
  const handleModalClose = () => setModal(false);
  const handleFacultyRemove = (facultyId) => {
    setFacultyList((prevList) =>
      prevList.filter((faculty) => faculty._id !== facultyId)
    );
  };

  return (
    (user && user.role === "admin") ? (
      <HodList />
    ):(
    <>
      <AddFacultyModel
        open={modal}
        handleClose={handleModalClose}
        handleAdd={fetchFaculty}
      />
      <Box
        className="faculty-list"
        sx={{
          width: `calc(100vw - ${drawerWidth}px)`,
          left: drawerWidth,
          top: "64px",
          position: "absolute",
          height: "calc(100% - 60px)",
          [theme.breakpoints.down("md")]: {
            height: "100%",
            maxWidth: "100vw",
            width: "100%",
            left: 0,
            flexDirection: "column-reverse",
            alignItems: "center",
          },
        }}
      >
        {facultyList.map((faculty, index) => (
          <FacultyCard
            key={index}
            faculty={faculty}
            user={user}
            token={token}
            onFacultyRemove={handleFacultyRemove}
          />
        ))}
      </Box>
      {user && user.role === "hod" && (
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
      )}
    </>
    )
  );
};

export default FacultyList;
