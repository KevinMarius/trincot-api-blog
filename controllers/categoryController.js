const Category = require("../models/category")
const jwtUtils = require('../helpers/jwtUtils')
const HttpError = require('../models/http-error')

exports.getCategories = async (req, res, next) => {
    await Category.find()
        .select("_id title description")
        .then(categories => {
            res.status(200).json({
                categories
            });
        })
        .catch(err => { 
            const error = new HttpError(
                'Could not find the categories.',
                500
            );
            return next(error); 
        })
};

/* exports.getCategoriesForPagination = async (req, res) => {
    const currentPage = req.params.page || 1;
    const perPage = 9;
    let categories;
    let categoryNbre;
    try {
        categories = await Category.find()
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);
    } catch (err) {
        throw new HttpError(err, 404);
    };
    try{
        categoryNbre = Category.count();
    } catch (err) {
        throw new HttpError(err, 404);
    };

    const pages = Math.ceil(categoryNbre / perPage);

    res.status(200).json({
        "categories": categories,
        "currentPage": currentPage,
        "pages": pages,
        "categoryNbre": categoryNbre
    });
}; */

exports.getCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    await Category.findById(categoryId)
        .select("_id title description")
        .then(category => {
            res.status(200).json({
                category
            });
        })
        .catch(err => { 
            const error = new HttpError(
                'Could not find the category.',
                500
            );
            return next(error); 
        })
};

exports.createCategory = async (req, res, next) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)

    if (userId < 0) {
        const error = new HttpError(
            'Wrong token.',
            404
        );
        return next(error);
    }

    const category = new Category(req.body)
    await category.save().then(result => {
        res.status(200).json({
            category: result
        });
    });

}

exports.deleteCategory = async (req, res, next) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    const categoryId = req.params.categoryId

    if (userId < 0) {
        const error = new HttpError(
            'Wrong token.',
            404
        );
        return next(error);
    }

    let category;
    try {
        category = await Category.findById(categoryId);
    } catch (e) {
        const error = new HttpError(
            'Category not found.',
            500
        );
        return next(error);
    }

    try {
        await category.delete();
    } catch (err) {
        const error = new HttpError(
            "Category don't delete successfully.",
            500
        );
        return next(error);
    }
    

    return res.status(200).json({ message: 'Category deleted successful.' });
}

exports.updateCategory = async (req, res, next) => {

    const headerAuth = req.headers['authorization']
    const userId = jwtUtils.getUserId(headerAuth)
    const categoryId = req.params.categoryId
    const { title, description } = req.body;

    if (userId < 0) {
        const error = new HttpError(
            'Wrong token.',
            404
        );
        return next(error);
    }

    await Category.findById(categoryId)
        .then(category => {
            category.title = title;
            category.description = description;

            category.save();
        })
        .then(result => {
            res.status(201).json({ result })
        })
        .catch(err => {
            const error = new HttpError(
                'Category not updatedd.',
                500
            );
            return next(error);
        })

}