const express = require('express');
const authorize = require('../helpers/authorize');
const router = express.Router();
const commentController = require("../controllers/commentController");
const { check } = require('express-validator');

router.get("/:postId", commentController.getComments);

router.post(
    "/:postId",
    [ 
        check('name')
            .not()
            .isEmpty(),
        check('content')
            .not()
            .isEmpty()
    ],
    commentController.createComment
);

router.delete("/:commentId", authorize(["admin"]), commentController.deleteCategory);

module.exports = router;