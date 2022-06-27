const express = require('express');
const router = express.Router()
const authoriseUser = require('../middlewares/auth')

const user = require("../controllers/UserController")
const post = require('../controllers/PostController')

router.get('/',authoriseUser,user.get);
router.get('/:id',authoriseUser,user.getById);
router.get('/:id/posts',post.get);


module.exports = router;