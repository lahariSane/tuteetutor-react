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
        required: false
    },
    type: {
        type: String,
        required: false,
        default: 'faculty'
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
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
