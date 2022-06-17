const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Users.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      console.error({ error });
      return next({
        status: 401,
        message: 'Not authorized',
      });
    }
  }

  return next({
    status: 401,
    message: 'Not authorized, no token',
  })
}

module.exports = {
  protect,
}