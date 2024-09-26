import mongoose from "mongoose";

const announcementSchema = mongoose.Schema({
    title: String,
    description: { type: String, required: [true, "Description is required"] },
    author: { type: String, required: [true, "Author is required"] },
    authorId: { type: String, required: [true, "Author ID is required"] },
    course: { type: String, required: [true, "Course is required"] },
    section: { type: String, required: [true, "Section is required"] },
    date: {
        type: Date,
        default: new Date()
    },
    file: {
        type: String
    },
});

const Announcements = mongoose.model('Announcements', announcementSchema);
export default Announcements;
