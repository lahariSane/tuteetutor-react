import mongoose from "mongoose";
import {
  syncAnnouncementToSolr,
  removeFromSolr,
} from "../middlewares/solrSync.js";

const announcementSchema = mongoose.Schema({
  title: String,
  description: { type: String, required: [true, "Description is required"] },
  author: { type: String, required: [true, "Author is required"] },
  authorId: { type: String, required: [true, "Author ID is required"] },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Course is required"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  file: {
    type: String,
  },
});

// Solr sync hooks
announcementSchema.post("save", function (doc) {
  syncAnnouncementToSolr(doc);
});

announcementSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    syncAnnouncementToSolr(doc);
  }
});

announcementSchema.post("remove", function (doc) {
  removeFromSolr(doc._id.toString(), "announcements");
});

const Announcements = mongoose.model("Announcements", announcementSchema);
export default Announcements;
