import Changes from "../models/changesModel";

class ChangesController {
    async getChanges(req, res) {
        try {
            const changes = await Changes.find();
            res.status(200).json(changes);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async createChange(req, res) {
        const change = req.body;
        const newChange = new Changes(change);
        try {
            await newChange.save();
            res.status(201).json(newChange);
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    }

    async updateChange(req, res) {
        const { id } = req.params;  
        const change = req.body;
    
        try {
          const existingChange = await Changes.findOne({ id });
          if (!existingChange) {
            return res.status(404).send("No change with that id");
          }
          const updatedChange = await Changes.findOneAndUpdate({ id }, { ...change }, { new: true });
          res.json(updatedChange);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
}

export default ChangesController;