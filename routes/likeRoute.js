const express = require('express')
const authorize = require('../helpers/authorize')
const router = express.Router()
const likeController = require("../controllers/likeController")


router.post("/:postId/vote/like", authorize(), likeController.likePost)
router.post("/:postId/vote/dislike", authorize(),  likeController.disLikePost)

module.exports = router;