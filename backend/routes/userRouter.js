const router = require('express').Router();
const controller = require('../controllers/userController');

router.route('/').post(controller.register);

module.exports = router;