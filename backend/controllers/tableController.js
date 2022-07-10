const { protect } = require('../middleware/auth');
const Tables = require('../models/tables');
const Users = require('../models/users');

const getAllTables = async (req, res, next) => {
  try {
    let tables;
    if (req.user) {
      tables = await Tables
        .find({ $or: [{private: false}, {user: req.user}] }, '-events')
        .populate('user', 'name _id');
    } else {
      tables = await Tables
        .find({ private: false }, '-events')
        .populate('user', 'name _id');
    }

    return res.json(tables);
  } catch (err) {
    console.error("Error", err);

    return next({
      status: 500,
      message: err.message,
    })
  }

}

const getTable = async (req, res, next) => {
  const { id } = req.params;

  const table = await Tables.findById(id)
    .populate('user', 'name _id');

  if (
    !table || 
    (table.private && (!req.user || !table.user.equals(req.user.id)))
  ) {
    return next({
      status: 404,
      message: `Table ${id} not found`,
    });
  }

  return res.json(table);
}

const createTable =  async (req, res, next) => {
  const requiredParams = ['name', 'events'];

  for (let param of requiredParams) {
    if (!req.body[param]) {
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

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const table = await Tables.findById(id);
    if (!table) {
      return next({
        status: 404,
        message: `Table ${id} not found`,
      });
    }

    if (!table.user.equals(req.user.id) || !req.user.admin) {
      return next({
        status: 401,
        message: 'You do not have permsion to perform that action.'
      });
    }

    await Tables.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {

  }
}

module.exports = {
  getAllTables,
  getTable: [getTable],
  createTable: [protect, createTable],
  delete: [protect, deleteTable]
}