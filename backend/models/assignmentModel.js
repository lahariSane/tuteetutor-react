import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema({
    description : { type: String, required: [true, "Description is required"] },
    marks : { type: Number },
    course: { type: String},
    section: { type: String},
    link: { type: String},
    deadline: { type: Date,
        default: new Date()
    },
});

const Assignments = mongoose.model('Assignments', assignmentSchema);
export default Assignments;

