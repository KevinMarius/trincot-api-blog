const express = require('express')
const authorize = require('../helpers/authorize')
const fileUpload = require('../helpers/fileUpload')
const userController = require('../controllers/userController')
const { check } = require('express-validator')

const router = express.Router()

router.get(
    "/get", 
    authorize(["admin"]), 
    userController.getUsers
);

router.post(
    "/create", 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('dateBorn')
            .isDate(),
        check('email')
            .isEmail(),
        check('password1')
            .matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/'),
        check('password')
            .matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/'),
        check('phone')
            .isNumeric(),
        check('picture')
            .not()
            .isEmpty()
    ],
    authorize(["admin"]), fileUpload.single('picture'), userController.createUser
);

router.post(
    "/password/update", 
    [
        check('password1').matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/'),
        check('password2').matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/'),
        check('currentPassword').matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/'),
    ], 
    authorize([]),
    userController.changePassword)
;

router.post(
    "/login", 
    [
        check('email')
            .not()
            .isEmpty()
            .isEmail(),
        check('password')
            .isLength({min: 8})
            .matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/')
    ],
    userController.login
);

router.get("/me", authorize(), userController.getUserProfile);
router.get("/:userId", authorize(["admin"]), userController.getUserProfile);

router.put(
    "/update/:userId", 
    authorize(), 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('dateBorn')
            .isDate(),
        check('phone')
            .isNumeric()
    ],
    userController.updateUserById
);

router.put(
    "/update", 
    authorize(), 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('dateBorn')
            .isDate(),
        check('email')
            .isEmail(),
        check('password')
            .matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/'),
        check('phone')
            .isNumeric()
    ],
    userController.updateMe
);

router.delete("/delete/:userId", authorize(["admin"]), userController.deleteUser);

module.exports = router;
