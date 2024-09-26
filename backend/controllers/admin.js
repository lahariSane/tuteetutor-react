import adminModel from '../models/admin.js';

// Controller for Admin operations
class AdminController {
  // Get all admins
  async getAllAdmins(req, res) {
    try {
      const admins = await adminModel.model.find({});
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: `Error fetching admins: ${error.message}` });
    }
  }

  // Get an admin by ID
  async getAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await adminModel.model.findById(id);
      if (admin) {
        res.status(200).json(admin);
      } else {
        res.status(404).json({ message: 'Admin not found' });
      }
    } catch (error) {
      res.status(500).json({ message: `Error fetching admin: ${error.message}` });
    }
  }

  // Add a new admin
  async addAdmin(req, res) {
    try {
      const adminData = req.body;  // Assuming body contains { username, email, password }
      const newAdmin = await adminModel.addAdmin(adminData);
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(500).json({ message: `Error adding admin: ${error.message}` });
    }
  }

  // Update an existing admin by ID
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedAdmin = await adminModel.updateAdmin(id, updateData);
      if (updatedAdmin) {
        res.status(200).json(updatedAdmin);
      } else {
        res.status(404).json({ message: 'Admin not found' });
      }
    } catch (error) {
      res.status(500).json({ message: `Error updating admin: ${error.message}` });
    }
  }

  // Delete an admin by ID
  async deleteAdmin(req, res) {
    try {
      const { id } = req.params;
      const deletedAdmin = await adminModel.deleteAdmin(id);
      if (deletedAdmin) {
        res.status(200).json({ message: 'Admin deleted successfully' });
      } else {
        res.status(404).json({ message: 'Admin not found' });
      }
    } catch (error) {
      res.status(500).json({ message: `Error deleting admin: ${error.message}` });
    }
  }

  // Verify admin login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const hashedPassword = password;  // Assuming the password is already hashed

      const admin = await adminModel.verifyLogin(email, hashedPassword);
      if (admin) {
        res.status(200).json({ message: 'Login successful', admin });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: `Error during login: ${error.message}` });
    }
  }
}

export default new AdminController();
