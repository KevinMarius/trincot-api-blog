const express = require('express');
const authorize = require('../helpers/authorize');
const router = express.Router();
const fileUpload = require('../helpers/fileUpload');
const postController = require('../controllers/postController');
const { check } = require('express-validator')

router.get("/get", postController.getPosts);
router.get("/get/:postId", postController.getPost);

router.put(
    "/:postId", 
    authorize(["admin", "author"]),
    [
        check('title')
            .not()
            .isEmpty(),
        check('content')
            .not()
            .isEmpty()
    ],  
    fileUpload.single('picture')
    , postController.updatePost
);

router.post(
    "/create", 
    authorize(["admin", "author"]), 
    fileUpload.single('picture'),
    [
        check('title')
            .not()
            .isEmpty(),
        check('content')
            .not()
            .isEmpty()
    ], 
    postController.createPost
);

router.delete("/delete/:postId", authorize(["admin"]), postController.deletePost);

router.put("/update/:postId", authorize(["admin"]), postController.changeStatePost)

module.exports = router;
