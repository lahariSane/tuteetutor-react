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
            email: req.user.email,
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
        const email = req.user.email; // Extract the signed-in user's email
        if (!email) {
            return res.status(400).json({ error: "User email is required" });
        }

        const leaveRequests = await LeaveRequest.find({ email: email });
        res.status(200).json(leaveRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
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