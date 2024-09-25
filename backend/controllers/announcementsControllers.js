import Announcements from "../models/announcementModel.js";

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcements.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createAnnouncement = async (req, res) => {
    const announcement = req.body;
    const newAnnouncement = new Announcements(announcement);
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