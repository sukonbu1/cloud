const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  // Validate input fields
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if username already exists
  let user = await User.findOne({ username: username.toLowerCase() });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  user = new User({
    username: username.toLowerCase(),
    password,
    role,
  });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Create a token
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user},
    process.env.JWT_SECRET,
  );

  await user.save();

  // Return user data and token
  res.json({ token, user });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign(
      { id: user._id, username: user.username , role: user.role},
      process.env.JWT_SECRET,
    );

    // Return the token
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
