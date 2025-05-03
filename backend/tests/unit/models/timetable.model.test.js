import mongoose from 'mongoose';
import Timetable from '../../../models/timetableModel.js'; // Adjust path accordingly

describe('Timetable Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/timetable-test');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid timetable entry', async () => {
    const timetable = new Timetable({
      day: 1,
      startTime: '09:00',
      endTime: '10:00',
      subject: 'MATH101',
      section: 'A',
      roomNo: '101'
    });

    const saved = await timetable.save();
    expect(saved._id).toBeDefined();
    expect(saved.subject).toBe('MATH101');
  });

  it('should fail if endTime is before startTime', async () => {
    const invalid = new Timetable({
      day: 2,
      startTime: '10:00',
      endTime: '09:00',
      subject: 'PHYS101',
      section: 'B',
      roomNo: '102'
    });

    await expect(invalid.save()).rejects.toThrow(/End time must be greater than start time/);
  });

  it('should fail with invalid time format', async () => {
    const invalid = new Timetable({
      day: 3,
      startTime: '25:00',  // Invalid hour
      endTime: '26:00',
      subject: 'CHEM101',
      section: 'C',
      roomNo: '103'
    });

    await expect(invalid.save()).rejects.toThrow(/Invalid time format/);
  });

  it('should fail if required fields are missing', async () => {
    const invalid = new Timetable({
      startTime: '09:00',
      endTime: '10:00',
      subject: 'CS101'
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail if subject is longer than 8 characters', async () => {
    const invalid = new Timetable({
      day: 4,
      startTime: '08:00',
      endTime: '09:00',
      subject: 'VERYLONGCODE',  // > 8 chars
      section: 'A',
      roomNo: '105'
    });

    await expect(invalid.save()).rejects.toThrow(/shorter form of the subject/);
  });
});
