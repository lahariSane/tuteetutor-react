import userModule from "../models/userModule.js";

const getUsers = async (req, res) => {
  try {
    const users = await userModule.find({
      $or: [{ role: "faculty" }, { role: "student" }],
      _id: { $ne: req.user.id },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { getUsers };