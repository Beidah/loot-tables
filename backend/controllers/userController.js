const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Tables = require('../models/tables');

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tables = req.query.tables && req.query.tables === "true";

    let user = await User.findById(id, '-password -admin');

    if (!user) {
      return next({
        status: 404,
        message: 'User not found',
      });
    }

    if (tables) {
      if (!req.user || req.user.id !== id) {
        await user.populate({
          path: 'tables',
          model: Tables,
          match: { private: false },
        });
      } else {
        await user.populate({
          path: 'tables',
          model: Tables
        });
      }
    }

    return res.json(user);
  } catch (error) {
    return next({
      status: 500,
      message: error.message,
    })
  }
}

const register = async (req, res, next) => {
  const requiredParams = ['email', 'name', 'password'];

  for (let param of requiredParams) {
    if (!req.body[param]) {
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
      token: generateToken(user._id),
    })
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    })
  }
}

const login = async (req, res, next) => {
  const requiredParams = ['email', 'password'];

  for (let param of requiredParams) {
    if (!req.body[param]) {
      console.error(req);
      return next({
        status: 400,
        message: `Missing parameter: ${param}`,
      });
    }
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return next({
        status: 400,
        message: "Invalid login",
      })
    }
  } catch (error) {
    return next({
      status: 500,
      message: error.message,
    })
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  getUser,
  register,
  login,
}