import mongoose from "mongoose";

const timeSchema = new mongoose.Schema({
    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 12  // Assuming the time format is 12-hour clock
    },
    minutes: {
      type: Number,
      required: true,
      min: 0,
      max: 59
    },
    part: {
      type: String,
      required: true,
      enum: ['AM', 'PM'],  // Ensures that only 'AM' or 'PM' is allowed
    }
  });

const breaksSchema = mongoose.Schema({
    startTime: timeSchema,
    endTime: timeSchema,
    break: { type: String, required: [true, "Description is required"] },
});

const Breaks = mongoose.model('Breaks', breaksSchema, 'breaks');
export default Breaks;