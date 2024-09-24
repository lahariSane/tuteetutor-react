import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/userModule.js';

const mailRouter = express.Router();

// Create a nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
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

        // Create an email message
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: 
      http://${req.headers.host}/reset-password/${token}`
        };

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
        console.log("hel");
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Generate OTP
        console.log("1");
        try {
            // Generate OTP
            const otp = crypto.randomInt(100000, 999999).toString();
            console.log('Generated OTP:', otp); // Debugging

            res.status(200).send('OTP generated successfully');
        } catch (error) {
            console.error('Error generating OTP:', error);
            res.status(500).send('Error generating OTP');
        }
        console.log("bye");

        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        console.log("2");
        // Create a user with the OTP and expiry, or update existing one (in case of resend)
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpires },
            { new: true, upsert: true }
        );

        console.log('Generated OTP:', otp);

        // Send email with OTP
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        });

        res.status(200).send('OTP sent successfully');
    } catch (error) {
        res.status(500).send('Error sending OTP');
    }
});


mailRouter.post('/signup', async (req, res) => {
    const { name, email, password, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email or OTP');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).send('Invalid or expired OTP');
        }

        // Hash the password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update user with name and password
        user.name = name;
        user.password = hashedPassword;
        user.otp = null; // Clear OTP
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Signup successful', token });
    } catch (error) {
        res.status(500).send('Error signing up');
    }
});







export default mailRouter;
