const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const auth = require('../middlewares/auth');


router.post('/login', AuthController.login)
router.get('/logout', AuthController.logout)
router.post('/register', AuthController.register)
router.get('/verify/:activationToken', AuthController.verify)
router.get('/checkToken',auth, AuthController.checkToken)
router.post('/refresh',AuthController.refresh)

module.exports = router;