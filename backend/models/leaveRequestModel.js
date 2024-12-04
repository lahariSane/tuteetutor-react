import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
    },
    studentID: {
        type: String,
        required: [true, 'Student ID is required'],
    },
    fromDate: {
        type: Date,
        required: [true, 'From date is required'],
    },
    toDate: {
        type: Date,
        required: [true, 'To date is required'],
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        default: 'Pending',
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    }
});
const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema);

export default LeaveRequest;