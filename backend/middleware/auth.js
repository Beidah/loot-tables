const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const logUserIn = async (req, _, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Users.findById(decoded.id).select('-password');

      if (user) {
        console.info('user', user.id)
        req.user = user;
      }
    } catch (error) {
      console.error({ error });
    }
  }

  return next();
}

const protect = async (req, res, next) => {
  if (req.user) {
    return next();
  }

  return next({
    status: 401,
    message: 'Not authorized',
  })
}

module.exports = {
  logUserIn,
  protect,
}