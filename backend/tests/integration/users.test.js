import request from 'supertest';
import app from '../../app.js'; // Adjust path to your Express app
import mongoose from 'mongoose';
// import userModule from '../models/userModule.js';
import jwt from 'jsonwebtoken';

// Generate JWT token with user payload
const generateToken = (role = 'admin') => {
  const user = { _id: new mongoose.Types.ObjectId().toString(), role };
  return jwt.sign(user, process.env.JWT_SECRET || 'testsecret');
};

const testUserData = {
  name: 'Test User',
  email: 'test@iiits.in',
  password: 'password123',
  role: 'user',
  bio: 'A test user',
  profileImage: 'http://example.com/image.jpg',
};

let userId;

beforeAll(async () => {
  const dbName = `test-db-${Date.now()}`;
  await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('User API', () => {
  it('should create a user (admin)', async () => {
    const token = generateToken('admin');
    const res = await request(app)
      .post('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send(testUserData);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.name).toBe('Test User');
    userId = res.body.user._id;
  });

  it('should get user by ID', async () => {
    const token = generateToken();
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@iiits.in');
  });

  it('should get all users (admin)', async () => {
    const token = generateToken('admin');
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get users by role', async () => {
    const token = generateToken();
    const res = await request(app)
      .get('/api/users/role')
      .set('Authorization', `Bearer ${token}`)
      .query({ role: 'user' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update user info (admin)', async () => {
    const token = generateToken('admin');
    const res = await request(app)
      .put(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Updated Name');
  });

  it('should not allow HOD to create admin', async () => {
    const token = generateToken('hod');
    const res = await request(app)
      .post('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testUserData, role: 'admin', email: 'newadmin@example.com' });
    expect(res.statusCode).toBe(403);
  });

  it('should delete user (admin)', async () => {
    const token = generateToken('admin');
    const res = await request(app)
      .delete(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('should return 404 for non-existent user', async () => {
    const token = generateToken();
    const res = await request(app)
      .get(`/api/user/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
