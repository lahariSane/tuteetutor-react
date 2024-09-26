import courseModel from '../models/courseModel.js';


const getCourse = async (req, res) => {
    try {
        const courses = await courseModel.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createCourse = async (req, res) => {
    const course = req.body;
    const newCourse = new courseModel(course);
    try {
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deleteCourse = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        await courseModel.findByIdAndRemove(id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export { getCourse, createCourse, deleteCourse };