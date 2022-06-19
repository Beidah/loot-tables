const { protect } = require('../middleware/auth');
const Tables = require('../models/tables');

const createTable =  async (req, res, next) => {
  const requiredParams = ['name', 'table'];

  for (let param of requiredParams) {
    if (!req.body[param]) {
      console.error(req);
      return next({
        status: 400,
        message: `Missing parameter: ${param}`,
      });
    }
  }

  const { name, table, private = false } = req.body;
  const { user } = req;

  const tableExists = await Tables.findOne({ name, user });
  if (tableExists) {
    return next({
      status: 400,
      message: `You already have a table called ${name}`
    });
  }

  const newTable = new Tables({
    name,
    table,
    private,
    user: req.user.id,
  });

  try {
    const tableToSave = await newTable.save();
    return res.status(201).json(tableToSave);
  } catch (error) {
    return next({
      status: 400,
      message: error.message
    });
  }
}

module.exports = {
  createTable: [protect, createTable],
}