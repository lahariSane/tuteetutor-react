import mongoose from 'mongoose';
import Announcements from '../../../models/announcementModel.js'; // adjust the path as needed

describe('Announcements Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/announcement-model-test');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid announcement', async () => {
    const validAnnouncement = new Announcements({
      title: 'Test Announcement',
      description: 'This is a test announcement.',
      author: 'Faculty A',
      authorId: 'faculty123',
      course: new mongoose.Types.ObjectId(),
      file: 'http://example.com/file.pdf',
    });

    const saved = await validAnnouncement.save();
    expect(saved._id).toBeDefined();
    expect(saved.description).toBe('This is a test announcement.');
    expect(saved.title).toBe('Test Announcement');
    expect(saved.date).toBeInstanceOf(Date);
  });

  it('should fail without description', async () => {
    const badAnnouncement = new Announcements({
      title: 'Missing description',
      author: 'Faculty A',
      authorId: 'faculty123',
      course: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await badAnnouncement.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.description).toBeDefined();
  });

  it('should fail without author', async () => {
    const badAnnouncement = new Announcements({
      title: 'No Author',
      description: 'Test',
      authorId: 'faculty123',
      course: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await badAnnouncement.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.author).toBeDefined();
  });

  it('should fail without authorId', async () => {
    const badAnnouncement = new Announcements({
      title: 'No Author ID',
      description: 'Test',
      author: 'Faculty A',
      course: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await badAnnouncement.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.authorId).toBeDefined();
  });

  it('should fail without course ObjectId', async () => {
    const badAnnouncement = new Announcements({
      title: 'No Course',
      description: 'Test',
      author: 'Faculty A',
      authorId: 'faculty123',
    });

    let error;
    try {
      await badAnnouncement.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.course).toBeDefined();
  });
});
