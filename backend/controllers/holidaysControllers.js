import Holiday from "../models/holidayModel.js";

const getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find();
        res.status(200).json(holidays);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createHoliday = async (req, res) => {
    const holiday = req.body;

    try {
        const data = {
            date: holiday.date,
            occation: holiday.occation
        };
        const existingHoliday = await Holiday.findOne(data);

        if (existingHoliday) {
            return res.status(409).json({ message: 'Duplicate holiday entry: A holiday with the same date and occation already exists.' });
        }

        const newHoliday = new Holiday(data);
        await newHoliday.save();
        res.status(201).json(newHoliday);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deleteHoliday = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No holiday with that id');
    await Holiday.findByIdAndRemove(id);
    res.json({ message: 'Holiday deleted successfully' });
}

export { getHolidays, createHoliday, deleteHoliday };