const router = require('express').Router();
const controller = require('../controllers/userController');

router.route('/').post(controller.register);
router.route('/login').post(controller.login);
router.get('/:id', controller.getUser);

module.exports = router;