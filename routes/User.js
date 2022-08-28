const express = require('express');
const router = express.Router()
const authoriseUser = require('../middlewares/auth')

const user = require("../controllers/UserController")
const post = require('../controllers/PostController')

router.get('/',authoriseUser,user.get);
router.get('/:id',authoriseUser,user.getById);
router.get('/search',authoriseUser,user.search);
router.get('/:id/posts', authoriseUser,post.get);

//TODO ADD PAGINATION
router.post('/:id/posts',authoriseUser,post.newPost);
router.delete('/:id/posts/:postId',authoriseUser,post.deleteSingle);
router.delete('/:id/posts',authoriseUser,post.deleteAllPosts);


module.exports = router;