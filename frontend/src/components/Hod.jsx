import React, { useEffect } from "react";
import "../styles/Faculty.css";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  createTheme,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import AddFacultyModel from "./AddFacultyModel";
import axios from "axios";
import debounce from "lodash.debounce";
import { Avatar } from "@mui/material";

const stringToColor = (string) => {
  if (!string) return "#007bff";
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const blendedValue = Math.floor((value + 255) / 1.5);
    color += `00${blendedValue.toString(16)}`.slice(-2);
  }
  return color;
};

const FacultyCard = ({ faculty, onFacultyRemove, role }) => {
  const instructor = faculty;
  const handleClick = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/${role}/${instructor._id}/`
      );
      if (response.status === 200) {
        onFacultyRemove(faculty._id);
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  return (
    <div className="faculty-container">
      <Box className="faculty-card" sx={{ height: "300px" }}>
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
          >
            {instructor?.name[0]}
          </Avatar>
        </div>
        <div className="faculty-details">
          <h3>{instructor?.name}</h3>
          <p className="email">{instructor?.email}</p>
          <p>
            {faculty?.code} - {faculty?.section}
          </p>
          <p>{faculty?.department}</p>
        </div>
        <button className="remove-button" onClick={handleClick}>
          <i className="fas fa-trash-alt"></i> Remove
        </button>
      </Box>
    </div>
  );
};

const HodList = () => {
  const [role, setRole] = React.useState("hod");
  const [facultyList, setFacultyList] = React.useState([]);
  const [hodList, setHodList] = React.useState([]);
  const [modal, setModal] = React.useState(false);

  const navigate = useNavigate();
  const data = useOutletContext();
  const drawerWidth = data.drawerWidth;

  const theme = createTheme({
    breakpoints: { values: { sm: 700, md: 1380 } },
  });

  const fetchData = React.useCallback(
    debounce(async (role) => {
      try {
        const res = await axios.get(`http://localhost:5000/faculty`, {
          params: { role },
        });
        console.log(res.data);
        if (res?.data?.message) {
          navigateBasedOnMessage(res.data.message);
        } else {
          const list = Array.isArray(res.data) ? res.data : [];
          if (role === "faculty") {
            setFacultyList(list);
          } else {
            setHodList(list);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const navigateBasedOnMessage = (message) => {
    if (message === "No registered courses found for the student.") {
      navigate("/coursesSelection");
    } else if (message === "No registered courses found for the faculty.") {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData(role);
  }, [role]);

  const handleModalOpen = () => setModal(true);
  const handleModalClose = () => setModal(false);

  const handleFacultyRemove = (facultyId) => {
    if (role === "faculty") {
      setFacultyList((prevList) =>
        prevList.filter((faculty) => faculty._id !== facultyId)
      );
    } else {
      setHodList((prevList) =>
        prevList.filter((faculty) => faculty._id !== facultyId)
      );
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    fetchData(event.target.value); // Fetch data based on selected role
  };

  return (
    <>
      <AddFacultyModel
        open={modal}
        handleClose={handleModalClose}
        handleAdd={() => fetchData(role)}
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
        <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
          <FormControl sx={{ minWidth: 120, marginBottom: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="hod">HOD</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {(role === "faculty" ? facultyList : hodList).map((faculty, index) => (
          <FacultyCard
            key={index}
            faculty={faculty}
            onFacultyRemove={handleFacultyRemove}
            role={role}
          />
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
        Add {role.toUpperCase()}
      </Fab>
    </>
  );
};

export default HodList;
