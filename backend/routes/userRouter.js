import express from 'express';
import userModule from '../models/userModule.js';
import validateUser  from '../middlewares/validateUser.js';

const userinfoRouter = express.Router();

userinfoRouter.get('/users/role', validateUser(), async (req, res) => {
  try {
    const role = req.query.role;
    const users = await userModule.find({ role });

    if (!users.length) return res.status(404).json({ message: `No users found for role: ${role}` });

    res.json(users.map(({ _id, name, email, role, bio, profileImage }) => ({ _id, name, email, role, bio, profileImage })));
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
userinfoRouter.get('/users',validateUser(["admin"]), async (req, res) => {
  try {
    const users = await userModule.find();
    if (!users.length) return res.status(404).json({ message: 'No users found' });
    res.json(users.map(({ name, email, role, bio, profileImage }) => ({ name, email, role, bio, profileImage })));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user personal information by ID
userinfoRouter.get('/user/:id',validateUser(), async (req, res) => {
  try {
    const user = await userModule.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, role, bio, profileImage } = user;
    res.json({ name, email, role, bio, profileImage });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user
userinfoRouter.post('/user',validateUser(["hod", "admin"]), async (req, res) => {
  try {
    const { name, email, password, role, bio, profileImage } = req.body;
    if(req.user.role == hod && role == "admin") return res.status(403).json({ message: 'HOD cannot create admin users' });
    if(req.user.role == hod && role == "hod") return res.status(403).json({ message: 'HOD cannot create HOD users' });
    const newUser = new userModule({ name, email, password, role, bio, profileImage });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user information
userinfoRouter.put('/user/:id', validateUser(["hod", "admin"]), async (req, res) => {
  try {
    const { name, email, role, bio, profileImage } = req.body;
    if(req.user.role == hod && role == "admin") return res.status(403).json({ message: 'HOD cannot update admin users' });
    if(req.user.role == hod && role == "hod") return res.status(403).json({ message: 'HOD cannot update HOD users' });
    const user = await userModule.findByIdAndUpdate(
      req.params.id,
      { name, email, role, bio, profileImage },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
userinfoRouter.delete('/user/:id', validateUser(["hod", "admin"]), async (req, res) => {
  try {
    const user = await userModule.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if(user.role == "hod" && req.user.role == "hod") return res.status(403).json({ message: 'HOD cannot delete another HOD' });
    if(user.role == "admin" && req.user.role == "hod") return res.status(403).json({ message: 'HOD cannot delete admin users' });
    await userModule.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default userinfoRouter;