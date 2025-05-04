import mongoose from "mongoose";

const userCourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    courseRegistered: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course',
            required: true
        }
    ],
});

const userCourse = mongoose.model('usercourse', userCourseSchema);
export default userCourse;
