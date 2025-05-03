import mongoose from 'mongoose';
import User from '../../../models/userModule.js'; // Adjust path as needed

describe('User Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/user-model-test');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a user successfully with required fields', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@iiits.in',
      role: 'admin',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe('admin');
    expect(savedUser.notifications).toEqual([]);
  });

  it('should set default role to student', async () => {
    const user = new User({
      name: 'test user',
      email: 'test@iiits.in',
    });
    const savedUser = await user.save();
    expect(savedUser.role).toBe('student');
  });

  it('should not create a user without required fields', async () => {
    const user = new User({});

    let error = null;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should allow optional fields to be empty', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@iiits.in',
    });

    const savedUser = await user.save();
    expect(savedUser.password).toBeUndefined();
    expect(savedUser.bio).toBeUndefined();
    expect(savedUser.profileImage).toBeUndefined();
    expect(savedUser.otp).toBeUndefined();
  });
});
