import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    department: {
        type: String,
        required: true,
        default: 'CSE',
    },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
