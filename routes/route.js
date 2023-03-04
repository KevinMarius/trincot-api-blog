const express = require('express')
const postController = require('../controllers/postController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require("../controllers/commentController")
const likeController = require("../controllers/likeController")
const authorize = require('../helpers/authorize')
const router = express.Router()
const fileUpload = require('../helpers/fileUpload')

//=================== posts ====================
router.get("/posts", postController.getPosts)
router.put("/post/:postId", authorize(["admin", "author"]), fileUpload.single('image'), postController.updatePost)
router.post("/post/create", authorize(["admin", "author"]), fileUpload.single('image'), postController.createPost)
router.delete("/post/:postId", authorize(["admin"]), postController.deletePost)
router.put("/post/:postId", authorize(["admin"]), postController.changeStatePost)

//=================== users ======================
router.get("/users", authorize(["admin"]), userController.getUsers)
router.post("/user/create", authorize(["admin"]), fileUpload.single('image'), userController.createUser)
router.post("/user/login", userController.login)
router.get("/user/me", authorize(), userController.getUserProfile)
router.put("/user/:userId", authorize(), userController.updateUser)
router.delete("/user/:userId", authorize(["admin"]), userController.deleteUser)

//===================== category ======================
router.get("/categories", categoryController.getCategories)
router.post("/category", authorize(["admin"]), categoryController.createCategory)
router.delete("/category/:categoryId", authorize(["admin"]), categoryController.deleteCategory)
router.put("/category/:categoryId", authorize(["admin"]), categoryController.updateCategory)

//===================== comment =========================
router.get("/comments/:postId", commentController.getComments)
router.post("/comment/:postId", commentController.createComment)
router.delete("/comment/:commentId", authorize(["admin"]), commentController.deleteCategory)

//===================== like =============================
router.post("/post/:postId/vote/like", authorize(), likeController.liked)
router.post("/post/:postId/vote/dislike", authorize(), likeController.disLiked)

module.exports = router;      