const express = require('express');
const authorize = require('../helpers/authorize');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { check } = require('express-validator')


router.get("/get", categoryController.getCategories);
//router.get("/get/items/:page", categoryController.getCategoriesForPagination);
router.get("/get/:categoryId", categoryController.getCategory);

router.post(
    "/create", 
    authorize(["admin"]),
    [
        check('title')
            .not()
            .isEmpty(),
        check('description')
            .isLength({min: 5})
    ],
    categoryController.createCategory
);

router.delete("/delete/:categoryId", authorize(["admin"]), categoryController.deleteCategory);

router.put("/update/:categoryId", authorize(["admin"]), categoryController.updateCategory);

module.exports = router;