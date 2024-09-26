import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/userModule.js';
import jwt from 'jsonwebtoken';


const mailRouter = express.Router();

// Create a nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


mailRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Save the token and expiration time in the user's document
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Create an email message
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: 
        http://localhost:3000/reset-password/${token}`
        };
        //${req.headers.host}
        await transporter.sendMail(mailOptions);

        res.status(200).send('A password reset email has been sent.');
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});



mailRouter.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
        console.log(password);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).send('Password has been reset successfully.');
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});


// Generate OTP and send email
mailRouter.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log('Generated OTP:', otp); // Debugging


        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        // Create a user with the OTP and expiry, or update existing one (in case of resend)
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpires },
            { new: true, upsert: true }
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        console.log('Generated OTP:', otp);

        // Send email with OTP
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        });
        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error); // Log the error for debugging
        res.status(500).send(`Error sending OTP: ${error.message}`); // Return the error message
    }

});


mailRouter.post('/signup', async (req, res) => {
    const { name, email, password, otp } = req.body;
    console.log("tan");

    try {
        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(400).send('Invalid email or OTP');
        }
        // Check if OTP is valid and not expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).send('Invalid or expired OTP');
        }

        // Hash the password using bcrypt with a salt factor of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a JWT token
        const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update user with name and password
        user.name = name;
        user.password = hashedPassword;
        user.otp = null; // Clear OTP
        user.otpExpires = null;
        await user.save();
        console.log("5");
        res.status(200).json({ message: 'Signup successful', token });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).send('Error signing up');
    }
});


// Login with OTP verification
mailRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // Check if the password matches
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});
    

export default mailRouter;
