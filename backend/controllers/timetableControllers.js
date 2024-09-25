import Timetable from "../models/timetableModel.js";

const getTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.find();
        res.status(200).json(timetable);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createTimetable = async (req, res) => {
    const timetable = req.body;

    try {
        const data = {
            date: timetable.date,
            day: timetable.day,
            startTime: timetable.startTime,
            endTime: timetable.endTime,
            section: timetable.section,
            subject: timetable.subject,
            roomNo: timetable.roomNo
        };
        const existingTimetable = await Timetable.findOne(data);

        if (existingTimetable) {
            return res.status(409).json({ message: 'Duplicate timetable entry: A timetable with the same day, start time, and end time already exists.' });
        }

        const newTimetable = new Timetable(data);
        await newTimetable.save();
        res.status(201).json(newTimetable);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deleteTimetable = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No timetable with that id');
    await Timetable.findByIdAndRemove(id);
    res.json({ message: 'Timetable deleted successfully' });
}

export { getTimetable, createTimetable, deleteTimetable };