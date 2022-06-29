const { protect } = require('../middleware/auth');
const Tables = require('../models/tables');
const Users = require('../models/users');

const getTable = async (req, res, next) => {
  const { id } = req.params;

  const table = await Tables.findById(id)
    .populate('user', 'name _id');

  if (
    !table || 
    (table.private && (!req.user || table.user.equals(req.user)))
  ) {
    console.log(!table);
    return next({
      status: 404,
      message: 'Table not found',
    });
  }

  return res.json(table);
}

const createTable =  async (req, res, next) => {
  const requiredParams = ['name', 'events'];

  for (let param of requiredParams) {
    if (!req.body[param]) {
      console.error(req);
      return next({
        status: 400,
        message: `Missing parameter: ${param}`,
      });
    }
  }

  const { name, events, private = false } = req.body;
  const { user } = req;

  const tableExists = await Tables.findOne({ name, user });
  if (tableExists) {
    return next({
      status: 400,
      message: `You already have a table called ${name}`
    });
  }

  if (events.length < 2) {
    return next({
      status: 400,
      message: "'events' array needs at least two items."
    })
  }

  const newTable = new Tables({
    name,
    events,
    private,
    user: req.user.id,
  });

  try {
    const tableToSave = await newTable.save();
    await Users.findByIdAndUpdate(user.id, {$push: { tables: tableToSave }});
    return res.status(201).json(tableToSave);
  } catch (error) {
    return next({
      status: 400,
      message: error.message
    });
  }
}

module.exports = {
  getTable: [getTable],
  createTable: [protect, createTable],
}