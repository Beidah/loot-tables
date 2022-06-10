const router = require('express').Router();
const controller = require('../controllers/userController');

router.route('/').post(controller.register);
router.route('/login').post(controller.login);

module.exports = router;