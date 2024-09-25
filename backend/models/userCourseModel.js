import mongoose from "mongoose";

const userCourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    courseRegistered: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course'
        },
        section: {
            type: String,
            required: true,
        },
    }],
});

const Course = mongoose.model('UserCourse', userCourseSchema);
export default Course;