import mongoose from 'mongoose';
import userCourseSchema from "../models/userCourseModel.js";

// Get all user courses
const getUserCourses = async (req, res) => {
    try {
        console.log(req.user);
        const userCourses = await userCourseSchema.findOne({user: req.user.id}).populate('courseRegistered'); // Populate course details if needed
        res.status(200).json(userCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user course entry
const createUserCourse = async (req, res) => {
    const { user, courseRegistered } = req.body;
    try {
        // Validate input
        if (!user || !courseRegistered || !Array.isArray(courseRegistered)) {
            return res.status(400).json({ message: 'Invalid input: user and courseRegistered are required.' });
        }

        // Check for existing user course entry
        const existingUserCourse = await userCourseSchema.findOne({ user });
        
        if (existingUserCourse) {
            return res.status(409).json({ message: 'User already registered: A course registration for this user already exists.' });
        }

        // Create a new user course
        const newUserCourse = new userCourseSchema({ user, courseRegistered });
        await newUserCourse.save();
        return res.status(201).json(newUserCourse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update an existing user course entry (add more courses)
const updateUserCourse = async (req, res) => {
    const { user, courseRegistered } = req.body;

    try {
        // Validate input
        if (!user || !courseRegistered || !Array.isArray(courseRegistered)) {
            return res.status(400).json({ message: 'Invalid input: user and courseRegistered are required.' });
        }

        const existingUserCourse = await userCourseSchema.findOne({ user });

        if (existingUserCourse) {
            // Check for duplicates
            const duplicateCourse = courseRegistered.some(newCourseId =>
                existingUserCourse.courseRegistered.some(course => course.equals(newCourseId))
            );

            if (duplicateCourse) {
                return res.status(409).json({ message: 'Duplicate entry: The user is already registered for one of the provided courses.' });
            }

            // Add new courses to the existing record
            existingUserCourse.courseRegistered.push(...courseRegistered);
            await existingUserCourse.save();
            return res.status(200).json(existingUserCourse);
        }

        // If no existing entry, create a new one
        const newUserCourse = new userCourseSchema({ user, courseRegistered });
        await newUserCourse.save();
        return res.status(201).json(newUserCourse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Remove a specific course from the user's course list
const removeUserCourse = async (req, res) => {
    const { userId, courseId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).send('Invalid user or course ID');
    }

    try {
        const userCourse = await userCourseSchema.findOne({ user: userId });

        if (!userCourse) {
            return res.status(404).json({ message: 'User course not found' });
        }

        // Remove the specified course
        const updatedCourses = userCourse.courseRegistered.filter(course => !course.equals(courseId));

        if (updatedCourses.length === 0) {
            // If no courses remain, remove the user course entry
            await userCourseSchema.findByIdAndRemove(userCourse._id);
            return res.json({ message: 'All courses deleted for this user. User course entry removed.' });
        }

        // Update the course list
        userCourse.courseRegistered = updatedCourses;
        await userCourse.save();

        res.json({ message: 'Course removed successfully', updatedCourses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getUserCourses, createUserCourse, updateUserCourse, removeUserCourse };
