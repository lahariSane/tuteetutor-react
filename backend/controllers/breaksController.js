import Breaks from "../models/breaksModel.js";

class BreaksController {
    async getBreaks(req, res) {
        try {
            const breaks = await Breaks.find();
            res.status(200).json(breaks);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async createBreak(req, res) {
        console.log(req.body);
        const { startTime, endTime, description} = req.body;
        console.log(startTime, endTime, description);

        const newBreak = new Breaks({ startTime, endTime, description });
        try {
            await newBreak.validate();
            await newBreak.save();
            res.status(201).json(newBreak);
        }
        catch (error) {
            console.log(error);
            res.status(409).json({ message: error.message });
        }
    }

    async updateBreak(req, res) {
        const { id } = req.params;
        const breakData = req.body;

        try {
            const existingBreak = await Breaks.findOne({ id });
            if (!existingBreak) {
                return res.status(404).send("No break with that id");
            }
            const updatedBreak = await Breaks.findOneAndUpdate({ id }, { ...breakData }, { new: true });
            res.json(updatedBreak);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteBreak(req, res) {
        const { id } = req.params;
        // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No break with that id');
        await Breaks.findByIdAndDelete(id);
        res.json({ message: 'Break deleted successfully' });
    }
}

export default BreaksController;