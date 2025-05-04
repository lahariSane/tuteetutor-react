import React, { useEffect, useCallback, useState } from "react";
import "../styles/Faculty.css";
import { useOutletContext } from "react-router-dom";
import { Box, createTheme, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import AddUserModal from "./AddUserModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";

const stringToColor = (string) => {
  if (!string) return "#007bff";
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    const blendedValue = Math.floor((value + 255) / 1.5);
    color += `00${blendedValue.toString(16)}`.slice(-2);
  }
  return color;
};

const UserCard = ({ user, token, onUserRemove, onEditUser }) => {
  if (!user) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUserRemove(user._id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="faculty-container">
      <Box className="faculty-card">
        <div className="faculty-photo">
          <Avatar
            src={user?.profileImage}
            sx={{ width: "100px", height: "100px", bgcolor: stringToColor(user?.name) }}
          >
            {user?.name?.[0]}
          </Avatar>
        </div>
        <div className="faculty-details">
          <h3>{user.name}</h3>
          <p className="email">{user.email}</p>
        </div>
        <div>
          <button className="edit-button" onClick={() => onEditUser(user)}>
            <EditIcon />
            Edit
          </button>
          <button className="remove-button" onClick={handleDelete}>
            <i className="fas fa-trash-alt"></i> Remove
          </button>
        </div>
      </Box>
    </div>
  );
};

const UserList = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const userRole = jwtDecode(token).role; // Decode the JWT to get the user role
  const [selectedRole, setSelectedRole] = useState("faculty");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/role?role=${selectedRole}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [token, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleUserRemove = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <>
      <AddUserModal
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        handleUpdate={fetchUsers}
        userData={selectedUser} // Pass selected user for editing
      />
      <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel>Select Role</InputLabel>
        <Select value={selectedRole} onChange={handleRoleChange}>
          {userRole === "admin" && (
            <MenuItem value="hod">HOD</MenuItem>
          )}
          <MenuItem value="faculty">Faculty</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </Select>
      </FormControl>
      <Box className="faculty-list">
        {users.map((user, index) => (
          <UserCard key={index} user={user} token={token} onUserRemove={handleUserRemove} onEditUser={handleEditUser} />
        ))}
      </Box>
      <Fab
        onClick={() => {
          setSelectedUser(null);
          setModalOpen(true);
        }}
        color="primary"
        variant="extended"
        aria-label="add"
        sx={{ position: "absolute", bottom: "20px", right: "20px" }}
      >
        <AddIcon sx={{ marginRight: "6px" }} /> Add User
      </Fab>
    </>
  );
};

export default UserList;
