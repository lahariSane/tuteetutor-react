import mongoose from "mongoose";
import dotenv from "dotenv";
const dbName = "TuteeTutorReact";
const { ObjectId } = mongoose.Types;

dotenv.config();

class Database {
  constructor() {
    this.uri = `${process.env.DATABASE}`;
    this.connection = null;
  }
  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log("Database connected");
      this.connection = mongoose.connection;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      process.exit(1);
    }
  }

  async getCollections() {
    try {
      var collections = await mongoose.connection.client
        .db(dbName)
        .listCollections()
        .toArray();
      return collections;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }

  async getCollectionByName(name) {
    try {
      const data = await mongoose.connection.client
        .db(dbName)
        .collection(name)
        .find({})
        .toArray(); // Converts the cursor to an array of documents

      if (!data.length) {
        console.warn(
          `Collection "${name}" is empty or does not exist in database "${dbName}".`
        );
        return null;
      }

      return data;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }

  async updateLeaveRequestStatus(id, status) {
    try {
      const objectId = new ObjectId(id);
      const result = await mongoose.connection.db
        .collection("leaverequests")
        .updateOne({ _id: objectId }, { $set: { status } });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      if (!["hod", "faculty"].includes(role)) {
        throw new Error(
          "Invalid role provided. Allowed roles are 'hod' and 'faculty'."
        );
      }

      const usersCollection = mongoose.connection.db.collection("users");
      const users = await usersCollection.find({ role }).toArray();

      if (users.length === 0) {
        console.warn(`No users found for the role: ${role}`);
        return [];
      }
      return users;
    } catch (error) {
      console.error(`Error fetching users by role "${role}": ${error.message}`);
      throw error;
    }
  }

  async deleteFaculty(id) {
    try {
      const objectId = new ObjectId(id);
      const result = await mongoose.connection.db
        .collection("users")
        .deleteOne({ _id: objectId });

      if (result.deletedCount === 1) {
        // Remove faculty reference from the "courses" collection
        await mongoose.connection.client
          .db(dbName) // replace with your actual DB name
          .collection("courses")
          .updateMany(
            { "faculty.hod": objectId }, // Filter by the faculty reference
            { $pull: { "faculty.hod": objectId } } // Remove the reference from faculty.hod
          );

        console.log(
          "Faculty and associated course references deleted successfully."
        );
        return result;
      } else {
        throw new Error("Faculty not found.");
      }
    } catch (error) {
      console.error(`Error deleting faculty: ${error.message}`);
      throw error;
    }
  }

  async deleteHod(id) {
    try {
      const objectId = new ObjectId(id);
      const result = await mongoose.client.db
        .collection("users")
        .deleteOne({ _id: objectId });
      return result;
    } catch (error) {
      console.error(`Error deleting hod: ${error.message}`);
      throw error;
    }
  }
}

export default Database;
