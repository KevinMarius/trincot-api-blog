const express = require('express');
const authorize = require('../helpers/authorize');
const router = express.Router();
const commentController = require("../controllers/commentController");
const { check } = require('express-validator');

router.get("/get/:postId", commentController.getComments);
router.get("/getCountCommentsByPost/:postId", commentController.countCommentsByPost);

router.post(
    "/:postId",
    commentController.createComment
);

router.delete("/:commentId", authorize(["admin"]), commentController.deleteCategory);

module.exports = router;