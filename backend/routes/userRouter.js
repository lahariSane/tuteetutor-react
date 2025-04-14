import express from 'express';
import userModule from '../models/userModule.js';
import validateUser from '../middlewares/validateUser.js';

const userinfoRouter = express.Router();

/**
 * @swagger
 * /users/role:
 *   get:
 *     summary: Get users by role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: Role to filter users
 *     responses:
 *       200:
 *         description: Users with the specified role
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
userinfoRouter.get('/users/role', validateUser(), async (req, res) => {
  try {
    const role = req.query.role;
    const users = await userModule.find({ role });

    if (!users.length) return res.status(404).json({ message: `No users found for role: ${role}` });

    res.json(users.map(({ _id, name, email, role, bio, profileImage }) => ({ _id, name, email, role, bio, profileImage })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
userinfoRouter.get('/users', validateUser(["admin"]), async (req, res) => {
  try {
    const users = await userModule.find();
    if (!users.length) return res.status(404).json({ message: 'No users found' });
    res.json(users.map(({ name, email, role, bio, profileImage }) => ({ name, email, role, bio, profileImage })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user info by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userinfoRouter.get('/user/:id', validateUser(), async (req, res) => {
  try {
    const user = await userModule.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, role, bio, profileImage } = user;
    res.json({ name, email, role, bio, profileImage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user (HOD or Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, hod, user]
 *               bio:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
userinfoRouter.post('/user', validateUser(["hod", "admin"]), async (req, res) => {
  try {
    const { name, email, password, role, bio, profileImage } = req.body;
    if (req.user.role == "hod" && role == "admin") return res.status(403).json({ message: 'HOD cannot create admin users' });
    if (req.user.role == "hod" && role == "hod") return res.status(403).json({ message: 'HOD cannot create HOD users' });
    const newUser = new userModule({ name, email, password, role, bio, profileImage });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               bio:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userinfoRouter.put('/user/:id', validateUser(["hod", "admin"]), async (req, res) => {
  try {
    const { name, email, role, bio, profileImage } = req.body;
    if (req.user.role == "hod" && role == "admin") return res.status(403).json({ message: 'HOD cannot update admin users' });
    if (req.user.role == "hod" && role == "hod") return res.status(403).json({ message: 'HOD cannot update HOD users' });
    const user = await userModule.findByIdAndUpdate(
      req.params.id,
      { name, email, role, bio, profileImage },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user (Admin or HOD)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userinfoRouter.delete('/user/:id', validateUser(["hod", "admin"]), async (req, res) => {
  try {
    const user = await userModule.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role == "hod" && req.user.role == "hod") return res.status(403).json({ message: 'HOD cannot delete another HOD' });
    if (user.role == "admin" && req.user.role == "hod") return res.status(403).json({ message: 'HOD cannot delete admin users' });
    await userModule.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default userinfoRouter;
