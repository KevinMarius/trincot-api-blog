const express = require('express');
const router = express.Router();

const roleController = require("../controllers/roleController");

router.get("/get", roleController.getRoles);

module.exports = router;