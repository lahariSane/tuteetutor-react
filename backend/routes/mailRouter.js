import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/forgotpasswordModule.js';

const mailRouter = express.Router();

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

        // Create a nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

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




export default MailRouter;
