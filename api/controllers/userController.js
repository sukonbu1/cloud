const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  // Validate input fields
  if (!username || !password || !role) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  // Check if username already exists
  let user = await User.findOne({ username: username.toLowerCase() });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
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

  await user.save();

  // Return user data
  res.json({ user });
};


exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username.toLowerCase() });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Ensure that the response includes the role
      res.json({
          user: {
              username: user.username,
              role: user.role // Ensure role is included here
          },
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};
