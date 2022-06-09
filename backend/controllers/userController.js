const bcrypt = require('bcryptjs');
const User = require('../models/users');

const register = async (req, res, next) => {
  const requiredParams = ['email', 'name', 'password'];

  for (let param of requiredParams) {
    if (!req.body[param]) {
      console.error(req);
      return next({
        status: 400,
        message: `Missing parameter: ${param}`,
      });
    }
  }
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next({
      status: 400,
      message: 'Email already in use',
    });
  }

  const salt = await bcrypt.genSalt();
  const digest = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: digest
  });

  try {
    const userToSave = await user.save();
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    })
  }
}

module.exports = {
  register,
}