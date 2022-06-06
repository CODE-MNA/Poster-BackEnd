const express = require('express');
const router = express.Router()
const authoriseUser = require('../middlewares/auth')

const controller = require("../controllers/UserController")


router.get('/',authoriseUser,controller.get);
router.get('/:id',authoriseUser,controller.getById);


module.exports = router;