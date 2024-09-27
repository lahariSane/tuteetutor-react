import mongoose from "mongoose";

const userCourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    courseRegistered: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        }
    ],
});

const Course = mongoose.model('UserCourse', userCourseSchema);
export default Course;