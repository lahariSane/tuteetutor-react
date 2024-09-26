import LeaveRequest from '../models/leaveRequestModel.js';

const leaveRequestSubmit = async (req, res) => {
    const { studentName, studentID, fromDate, toDate, reason } = req.body;
    console.log(req.body);
    try {
        // Create a new LeaveRequest document
        const leaveRequest = new LeaveRequest({
            studentName,
            studentID,
            fromDate,
            toDate,
            reason,
        });

        // Save the document to MongoDB
        await leaveRequest.save();

        res.send('Leave request submitted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error submitting leave request');
    }
}

const leaveRequestGetAll = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find();
        res.json(leaveRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching leave requests' });
    }
}

const leaveRequestDelete = async (req, res) => {
    try {
        await LeaveRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave request deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting leave request' });
    }
}

export { leaveRequestSubmit, leaveRequestGetAll, leaveRequestDelete };