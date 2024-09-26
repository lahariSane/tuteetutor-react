import mongoose from "mongoose";

const holidaySchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    occasion: {
        type: String,
        required: true
    }
});

const Holiday = mongoose.model('Holiday', holidaySchema);
export default Holiday;
