import Breaks from "../models/breaksModel.js";

class BreaksController {
    // async getBreaks(req, res) {
    //     try {
    //         const breaks = await Breaks.find();
    //         res.status(200).json(breaks);
    //     }
    //     catch (error) {
    //         res.status(404).json({ message: error.message });
    //     }
    // }

    async getBreaks(req, res) {
        try {
          const page = parseInt(req.query.page) || 1;      // Current page number (default: 1)
          const limit = parseInt(req.query.limit) || 10;   // Items per page (default: 10)
          const skip = (page - 1) * limit;
      
          const [breaks, total] = await Promise.all([
            Breaks.find().skip(skip).limit(limit).lean(),
            Breaks.countDocuments()
          ]);
      
          res.status(200).json({
            breaks,
            totalPages: Math.ceil(total / limit),
            currentPage: page
          });
        } catch (error) {
          res.status(404).json({ message: error.message });
        }
      }      

    async createBreak(req, res) {
        const { startTime, endTime, description} = req.body;

        const newBreak = new Breaks({ startTime, endTime, description });
        try {
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid break ID" });
        }

        try {
            const breakToDelete = await Breaks.findById(id);
            if (!breakToDelete) {
                return res.status(404).json({ message: "Break not found" });
            }

            await breakToDelete.deleteOne();
            res.json({ message: "Break deleted successfully" });
        } catch (error) {
            console.error("Error deleting break:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

export default BreaksController;