const router = require('express').Router();
const controller = require('../controllers/tableController');

router.route('/')
  .get(controller.getAllTables)
  .post(controller.createTable);


router.route('/:id')
  .get(controller.getTable)
  .patch(controller.updateTable)
  .delete(controller.delete);

module.exports = router;