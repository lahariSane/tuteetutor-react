import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Stack, Card, Typography, Button, TextField } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import { validateLeaveRequestForm } from './validation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


function LeaveRequest() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [errors, setErrors] = useState({});

    const token = localStorage.getItem("token"); // Get token from localStorage
    const decodedToken = token ? jwtDecode(token) : null; // Decode token if available
    const userEmail = decodedToken ? decodedToken.email : null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const errors = validateLeaveRequestForm(formData);
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            const leaveRequest = {
                studentName: formData.get('studentName'),
                studentID: formData.get('studentID'),
                fromDate: formData.get('fromDate'),
                toDate: formData.get('toDate'),
                reason: formData.get('reason'),
                email: userEmail, // Use email from decoded token
            };

            if (token) {
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/leaveRequest/submit`, leaveRequest, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then((response) => {
                        event.currentTarget.reset();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                console.error("No token found. Please log in.");
            }
        } else {
            console.log('Form is invalid');
            return;
        }
    };

    const handleDeleteRequest = (id) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/leaveRequest/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setLeaveRequests(leaveRequests.filter((request) => request._id !== id));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (token) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/leaveRequest/all`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Ensure token is passed in headers
                },
            })
                .then((response) => {
                    setLeaveRequests(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("Token is not available. Please log in.");
        }
    }, [token]);  // Refresh on token change

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Card elevation={4} sx={{ padding: "20px", marginBottom: "10px", backgroundColor: "#fafafa", borderRadius: "10px" }}>
                    <Stack spacing={2}>
                        <Typography variant="h5">Submit Leave Request</Typography>
                        <TextField label="Student Name" fullWidth name="studentName" />
                        <TextField label="Student ID" fullWidth name="studentID" />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="FromDate"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                name="fromDate"
                            />
                            <TextField
                                label="LastDate"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                name="toDate"
                            />
                        </Stack>
                        <TextField label="Reason" multiline rows={4} fullWidth name="reason" />
                        <input
                            type="file"
                            accept="image/*,application/pdf" // Adjust according to accepted file types
                            style={{ marginTop: "10px" }}
                            name="proof"
                        />
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" type="submit" sx={{ fontSize: "1rem", padding: "5px 5px", minWidth: "50px" }}>Submit</Button>
                            <Button type="reset" onClick={(handleSubmit) => handleSubmit.currentTarget.form.reset()} variant="contained" color="primary" sx={{ fontSize: "1rem", padding: "5px 5px", minWidth: "50px" }}>Reset</Button>
                        </Stack>
                    </Stack>
                </Card>
                {errors.studentName && <div style={{ color: 'red' ,fontSize: '18px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>{errors.studentName}</div>}
                {errors.studentID && <div style={{ color: 'red' ,fontSize: '18px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>{errors.studentID}</div>}
                {errors.fromDate && <div style={{ color: 'red' ,fontSize: '18px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>{errors.fromDate}</div>}
                {errors.toDate && <div style={{ color: 'red' ,fontSize: '18px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>{errors.toDate}</div>}
                {errors.reason && <div style={{ color: 'red' ,fontSize: '18px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>{errors.reason}</div>}
                {errors.proof && <div style={{ color: 'red' ,fontSize: '18px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>{errors.proof}</div>}
            </form>
            <Card elevation={4} sx={{ padding: "20px", marginBottom: "10px", backgroundColor: "#fafafa", borderRadius: "10px" }}>
                <Typography variant="h5">Leave Requests</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }}>Student Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }}>Student ID</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }}>From Date</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }}>To Date</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }}>Reason</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1.05rem" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaveRequests.map((request, index) => (
                                <TableRow key={index}>
                                    <TableCell>{request.studentName}</TableCell>
                                    <TableCell>{request.studentID}</TableCell>
                                    <TableCell>{new Date(request.fromDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>
                                    <TableCell>{new Date(request.toDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>
                                    <TableCell>{request.reason}</TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" color="error" onClick={() => handleDeleteRequest(request._id)}>Cancel</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    );
}

export default LeaveRequest;
