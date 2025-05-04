import mongoose from 'mongoose';
import LeaveRequest from '../../../models/leaveRequestModel.js'; // Adjust path accordingly

describe('LeaveRequest Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/leave-request-test');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid leave request', async () => {
    const validLeave = new LeaveRequest({
      studentName: 'John Doe',
      studentID: '12345',
      fromDate: new Date('2025-05-10'),
      toDate: new Date('2025-05-12'),
      reason: 'Medical leave',
      email: 'john@example.com'
    });

    const saved = await validLeave.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('Pending'); // default
    expect(saved.reason).toBe('Medical leave');
  });

  it('should fail without studentName', async () => {
    const invalid = new LeaveRequest({
      studentID: '12345',
      fromDate: new Date(),
      toDate: new Date(),
      reason: 'Urgent',
      email: 'john@example.com'
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail without studentID', async () => {
    const invalid = new LeaveRequest({
      studentName: 'John',
      fromDate: new Date(),
      toDate: new Date(),
      reason: 'Urgent',
      email: 'john@example.com'
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail without fromDate', async () => {
    const invalid = new LeaveRequest({
      studentName: 'John',
      studentID: '12345',
      toDate: new Date(),
      reason: 'Urgent',
      email: 'john@example.com'
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail without toDate', async () => {
    const invalid = new LeaveRequest({
      studentName: 'John',
      studentID: '12345',
      fromDate: new Date(),
      reason: 'Urgent',
      email: 'john@example.com'
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail without reason', async () => {
    const invalid = new LeaveRequest({
      studentName: 'John',
      studentID: '12345',
      fromDate: new Date(),
      toDate: new Date(),
      email: 'john@example.com'
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail without email', async () => {
    const invalid = new LeaveRequest({
      studentName: 'John',
      studentID: '12345',
      fromDate: new Date(),
      toDate: new Date(),
      reason: 'Personal',
    });

    await expect(invalid.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
