import mongoose from "mongoose";

const changesSchema = mongoose.Schema({
    id: { type: string, required: true, unique: true },
    date: { type: number, required: true },
    month: { type: number, required: true },
    year: { type: number, required: true },
    changeTo: { type: number, required: true },
});

const Changes = mongoose.model('Changes', changesSchema, 'changes');
export default Changes;