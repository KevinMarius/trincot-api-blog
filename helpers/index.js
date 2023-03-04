
exports.createPostValidator = (req, res, next) => {
    //================== title ======================
    req.check("title", "Write a title").notEmpty(),
    req.check("title", "Title must be between 4 to 150 characters").isLength({
        min: 3,
        max: 150
    });

    //============== content ====================
    req.check("content", "Write a content").notEmpty(),
    req.check("content", "content must be between 3 to 5000 characters").isLength({
        min: 3,
        max: 5000
    });

    const errors = req.validationErrors()

    if(errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    //========== process to next middleware ===========
    next();
}