import mongoose from 'mongoose';
import Breaks from '../../../models/breaksModel.js'; // Adjust the path as needed

describe('Breaks Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/breaks-model-test');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid break', async () => {
    const breakData = {
      startTime: { hours: 10, minutes: 30, part: 'AM' },
      endTime: { hours: 11, minutes: 0, part: 'AM' },
      description: 'Morning break'
    };

    const breakEntry = new Breaks(breakData);
    const savedBreak = await breakEntry.save();

    expect(savedBreak._id).toBeDefined();
    expect(savedBreak.description).toBe('Morning break');
    expect(savedBreak.startTime.hours).toBe(10);
    expect(savedBreak.endTime.part).toBe('AM');
  });

  it('should throw validation error for missing description', async () => {
    const breakData = {
      startTime: { hours: 9, minutes: 0, part: 'AM' },
      endTime: { hours: 9, minutes: 15, part: 'AM' }
    };

    let error = null;
    try {
      await new Breaks(breakData).save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.description).toBeDefined();
  });

  it('should throw validation error for invalid hour value', async () => {
    const breakData = {
      startTime: { hours: 13, minutes: 0, part: 'AM' }, // Invalid hour (> 12)
      endTime: { hours: 1, minutes: 0, part: 'PM' },
      description: 'Lunch break'
    };

    let error = null;
    try {
      await new Breaks(breakData).save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors['startTime.hours']).toBeDefined();
  });

  it('should throw validation error for invalid minutes value', async () => {
    const breakData = {
      startTime: { hours: 11, minutes: 60, part: 'AM' }, // Invalid minutes (> 59)
      endTime: { hours: 12, minutes: 0, part: 'PM' },
      description: 'Late morning break'
    };

    let error = null;
    try {
      await new Breaks(breakData).save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors['startTime.minutes']).toBeDefined();
  });

  it('should throw validation error for invalid part (AM/PM)', async () => {
    const breakData = {
      startTime: { hours: 10, minutes: 30, part: 'XX' }, // Invalid part
      endTime: { hours: 11, minutes: 0, part: 'PM' },
      description: 'Weird break'
    };

    let error = null;
    try {
      await new Breaks(breakData).save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors['startTime.part']).toBeDefined();
  });
});
