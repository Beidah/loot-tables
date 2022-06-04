const register = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next({
      status: 400,
      message: 'Missing parameters',
    });
  }

  res.status(201).json({ user: {
    name, email,
  }});
}

module.exports = {
  register,
}