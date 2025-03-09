import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../helpers/helper.js'; // Ensure this function exists

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!['user', 'retailer', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login Successfully',
      token: token,
      role: user.role, // ✅ Send role for debugging
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

