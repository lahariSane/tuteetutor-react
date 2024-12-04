import express from 'express';
import userModule from '../models/userModule.js';

const userinfoRouter = express.Router();

// Get user personal information (name, email, role)
userinfoRouter.get('/user/:id', async (req, res) => {
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

// Update user personal information (name, email, role)
userinfoRouter.put('/user/:id', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await userModule.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true } // to return the updated user object
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Personal information updated successfully', user });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


userinfoRouter.put('/user/:id/bio', async (req, res) => {
    const { id } = req.params;
    const { bio } = req.body;

    try {
        const user = await userModule.findByIdAndUpdate(
            id,
            { bio },
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ message: 'Failed to update bio' });
    }
});



export default userinfoRouter;
