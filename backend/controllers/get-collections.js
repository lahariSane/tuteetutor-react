import Database from "../models/db.js";
import LeaveRequest from "../models/leaveRequestModel.js";
import userModule from "../models/userModule.js";

class Collections {
  constructor() {
    this.db = new Database();
  }

  getCollections = async (req, res) => {
    try {
      // Fetch collections from the database
      const collections = await this.db.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  getCollectionByName = async (req, res) => {
    try {
      const collection = await this.db.getCollectionByName(req.params.name);
      res.json(collection);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  updateLeaveRequestStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const data = await LeaveRequest.findOne({ _id: req.params.id });
      const response = await this.db.updateLeaveRequestStatus(
        req.params.id,
        status
      );

      const notificationMessage = `Your leave request for ${data.fromDate} to ${data.toDate} has been ${status}.`;
      const faculty = await userModule.findOne({ email: data.email });
      if (faculty) {
        const newNotification = {
          title: "Leave Request Status Update",
          message: notificationMessage,
          isRead: false, // Default to unread
          time: new Date(), // Optional, for tracking when the notification was created
          type: status === "Declined" ? "warning" : "success",
        };
        faculty.notifications = [
          ...(faculty.notifications || []),
          newNotification,
        ];
        await faculty.save();
      }

      res.json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  getFaculty = async (req, res) => {
    try {
      const role = req.query.role;
      const faculty = await this.db.getUsersByRole(role);
      res.json(faculty);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  deleteFaculty = async (req, res) => {
    try {
      const response = await this.db.deleteFaculty(req.params.id);
      res.json(response);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  deleteHod = async (req, res) => {
    try {
      const response = await this.db.deleteHod(req.params.id);
      res.json(response);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
}

export default Collections;
