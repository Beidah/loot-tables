const router = require('express').Router();
const controller = require('../controllers/tableController');

router.route('/').post(controller.createTable);

module.exports = router;