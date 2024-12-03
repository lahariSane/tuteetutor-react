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
      const result = await mongoose.connection.client
        .db(dbName)
        .collection("leaverequests")
        .updateOne({ _id: objectId }, { $set: { status } });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }
}

export default Database;
