const express = require('express');
const router = express.Router();

const ambulanceController = require('../controller/ambulance_controller.js');

router.get('/nearby-hospitals', ambulanceController.nearby_hospitals);

module.exports = router;