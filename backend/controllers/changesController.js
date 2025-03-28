import Changes from "../models/changesModel.js";
class ChangesController {
  async getChanges(req, res) {
      try {
          const changes = await Changes.find();
          res.status(200).json(changes);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }

  async getChange(req, res) {
      try {
          const change = await Changes.findOne({ id: req.params.id });
          if (!change) return res.status(404).json({ message: "Change not found" });
          res.json(change);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }

  async createChange(req, res) {
    console.log(req.body);
      try {
          const newChange = new Changes(req.body);
          await newChange.save();
          res.status(201).json(newChange);
      } catch (error) {
          res.status(400).json({ message: error.message });
      }
  }

  async updateChange(req, res) {
      try {
          const updatedChange = await Changes.findOneAndUpdate(
              { _id: req.params.id },
              req.body,
              { new: true }
          );
          if (!updatedChange) return res.status(404).json({ message: "Change not found" });
          res.json(updatedChange);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }

  async deleteChange(req, res) {
      try {
          const deletedChange = await Changes.findOneAndDelete({ _id: req.params.id });
          if (!deletedChange) return res.status(404).json({ message: "Change not found" });
          res.json({ message: "Change deleted successfully" });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }
}

export default ChangesController;
