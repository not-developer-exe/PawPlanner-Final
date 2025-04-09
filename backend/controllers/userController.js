import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

// Login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            userId: user._id.toString()
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            userId: user._id.toString()
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const updates = req.body;
        const user = await userModel.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const bookAppointment = async (req, res) => {
    try {
        // Implementation for booking appointment
        res.status(200).json({
            success: true,
            message: 'Appointment booked successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const listAppointment = async (req, res) => {
    try {
        // Implementation for listing appointments
        res.status(200).json({
            success: true,
            appointments: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        // Implementation for canceling appointment
        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const paymentRazorpay = async (req, res) => {
    try {
        // Implementation for Razorpay payment
        res.status(200).json({
            success: true,
            message: 'Payment initiated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        // Implementation for verifying Razorpay payment
        res.status(200).json({
            success: true,
            message: 'Payment verified'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const paymentStripe = async (req, res) => {
    try {
        // Implementation for Stripe payment
        res.status(200).json({
            success: true,
            message: 'Payment initiated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyStripe = async (req, res) => {
    try {
        // Implementation for verifying Stripe payment
        res.status(200).json({
            success: true,
            message: 'Payment verified'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
};
