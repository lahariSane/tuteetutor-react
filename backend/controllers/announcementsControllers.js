import Announcements from "../models/announcementModel.js";
import User from "../models/userModule.js";
import Course from "../models/courseModel.js";

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcements.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createAnnouncement = async (req, res) => {
    const { title, description, authorId } = req.body;
    
    const user = await User.findById(authorId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    
    const course = await Course.findOne({ instructor: authorId });
    if (!course) {
        // Send an error if the user is not an instructor of any course
        return res.status(403).json({ message: 'User is not an instructor of any course' });
    }

    const newAnnouncement = new Announcements({ title, description, authorId, author: user.name, course: course.name, section: course.section });
    try {
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No announcement with that id');
    await Announcements.findByIdAndRemove(id);
    res.json({ message: 'Announcement deleted successfully' });
};

export { getAnnouncements, createAnnouncement, deleteAnnouncement };