import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
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
    <Box sx={{ width: "100%", padding: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "10px", borderBottom: "2px solid #ddd", margin:"10px 20%", width:"90%" }}>
         <Box sx={{ flex: 3 }}>
          <Typography variant="h6" fontWeight="bold">Student Name</Typography>
        </Box>
        <Box sx={{ flex: 3 }}>
          <Typography variant="h6" fontWeight="bold">From Date</Typography>
        </Box>
        <Box sx={{ flex: 3 }}>
          <Typography variant="h6" fontWeight="bold">To Date</Typography>
        </Box>
        <Box sx={{ flex: 3 }}>
          <Typography variant="h6" fontWeight="bold">Reason</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" fontWeight="bold">Status</Typography>
        </Box>
        <Box sx={{ flex: 1 }}></Box> {/* Empty box for action buttons */}
        <Box sx={{ flex: 1 }}></Box> {/* Empty box for action buttons */}
      </Box>
      {leaveRequests.map((request) => (
        <Card
          key={request.id}
          sx={{
            margin: "10px 20%",
            border: request.status === "Accepted" ? "2px solid green" : request.status === "Declined" ? "2px solid red" : "none",
            display: "flex",
            flexDirection: "row",
            padding: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%", // Ensure full width
            boxSizing: "border-box", // Account for padding and borders
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <Box sx={{ flex: 3 }}>
              <Typography variant="body1"><strong>{request.studentName}</strong></Typography>
            </Box>
            <Box sx={{ flex: 3 }}>
              <Typography variant="body1">{formatDate(request.fromDate)}</Typography>
            </Box>
            <Box sx={{ flex: 3 }}>
              <Typography variant="body1">{formatDate(request.toDate)}</Typography>
            </Box>
            <Box sx={{ flex: 3 }}>
              <Typography variant="body1">{request.reason}</Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography variant="body1" color="text.secondary">{request.status || "Pending"}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              {request.status && (
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(request._id, "Accepted")}
                    sx={{ marginRight: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction(request._id, "Declined")}
                  >
                    Decline
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default LeaveApproval;
