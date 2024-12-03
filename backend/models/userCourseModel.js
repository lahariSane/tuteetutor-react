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

const userCourse = mongoose.model('UserCourse', userCourseSchema);
export default userCourse;