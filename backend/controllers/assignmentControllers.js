import Assignments from "../models/assignmentModel";

class AssignmentsController {
    async getAssignments(req, res) {
        try {
            const assignments = await Assignments.find();
            res.status(200).json(assignments);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    
    async createAssignment(req, res) {
        const { description, marks, course, section, link, deadline } = req.body;
        
        const newAssignment = new Assignments({ description, marks, course, section, link, deadline });
        try {
            await newAssignment.save();
            res.status(201).json(newAssignment);
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    }
    
    async deleteAssignment(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No assignment with that id');
        await Assignments.findByIdAndRemove(id);
        res.json({ message: 'Assignment deleted successfully' });
    }
}

export default AssignmentsController;