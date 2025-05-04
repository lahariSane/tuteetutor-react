import mongoose from "mongoose";

const changesSchema = mongoose.Schema({
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    changeTo: { type: Number, required: true },
});

changesSchema.index({ year: 1, month: 1, date: 1 }, { unique: true });

const Changes = mongoose.model('Changes', changesSchema, 'changes');
export default Changes;