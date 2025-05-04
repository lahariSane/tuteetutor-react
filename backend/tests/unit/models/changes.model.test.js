import mongoose from 'mongoose';
import Changes from '../../../models/changesModel.js'; // Update the path if needed

describe('Changes Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/changes-test');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid Changes document', async () => {
    const change = new Changes({
      date: 5,
      month: 4,
      year: 2025,
      changeTo: 2,
    });

    const saved = await change.save();
    expect(saved._id).toBeDefined();
    expect(saved.date).toBe(5);
    expect(saved.changeTo).toBe(2);
  });

  it('should fail when required fields are missing', async () => {
    const invalid = new Changes({
      month: 4,
      year: 2025,
      changeTo: 1
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail when a non-number is used for date/month/year/changeTo', async () => {
    const invalid = new Changes({
      date: 'fifth',
      month: 'April',
      year: 'TwentyTwentyFive',
      changeTo: 'two',
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
