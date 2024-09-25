import mongoose from "mongoose";

function validateTimeOrder(value) {
    const [startHours, startMinutes] = this.startTime.split(':').map(Number);
    const [endHours, endMinutes] = value.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return startTotalMinutes < endTotalMinutes;
}

const timetableSchema = mongoose.Schema({
    date: {
        type: String,
        default: "null",
    },
    day: {
        type: Number,
        required: [true, 'day is required'],
    },
    startTime: {
        type: String,  // Storing time as a string in "HH:MM" format
        required: [true, 'Start time is required'],
        match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, use HH:MM'],
    },
    endTime: {
        type: String,  // Storing time as a string in "HH:MM" format
        required: [true, 'End time is required'],
        match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, use HH:MM'],
        validate: {
            validator: validateTimeOrder,
            message: 'End time must be greater than start time',
        },
    },
    subject: {
        type: String,
        required: [true, 'subject is required'],
        maxlength: [8, 'Provide a shorter form of the subject'],
    },
    section: {
        type: String,
        required: [true, 'section is required'],
    },
    roomNo: {
        type: String,
        required: [true, 'roomNo is required'],
    }
});

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;