import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave requests from the backend
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/collections/leaverequests`);
        setLeaveRequests(response.data); // Assuming response data is an array of leave requests
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [leaveRequests]);

  // Handle the action of accepting or declining a leave request
  const handleAction = async (id, status) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/collections/leaverequests/${id}`, { status });
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error("Error updating leave request status:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Return null if the date is invalid
    if (isNaN(date)) return null;
    
    // Get the parts of the date (year, month, day)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: "100vw", padding: 2, height: "50vh", overflowY: "auto" }}>
      <TableContainer component={Paper} sx={{width:"85vw"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6" fontWeight="bold">Student Name</Typography></TableCell>
              <TableCell><Typography variant="h6" fontWeight="bold">From Date</Typography></TableCell>
              <TableCell><Typography variant="h6" fontWeight="bold">To Date</Typography></TableCell>
              <TableCell><Typography variant="h6" fontWeight="bold">Reason</Typography></TableCell>
              <TableCell><Typography variant="h6" fontWeight="bold">Status</Typography></TableCell>
              <TableCell colSpan={2}><Typography variant="h6" fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow
                key={request.id}
                sx={{
                  backgroundColor:
                    request.status === "Accepted"
                      ? "rgba(0, 255, 0, 0.1)"
                      : request.status === "Declined"
                      ? "rgba(255, 0, 0, 0.1)"
                      : "inherit",
                }}
              >
                <TableCell>{request.studentName}</TableCell>
                <TableCell>{formatDate(request.fromDate)}</TableCell>
                <TableCell>{formatDate(request.toDate)}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell
                  sx={{
                    color:
                      request.status === "Accepted"
                        ? "green"
                        : request.status === "Declined"
                        ? "red"
                        : "grey",
                  }}
                >
                  {request.status || "Pending"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(request._id, "Accepted")}
                    sx={{ marginRight: "10px" }}
                  >
                    Accept
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction(request._id, "Declined")}
                  >
                    Decline
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeaveApproval;
