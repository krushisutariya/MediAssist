const express = require('express');
const router = express.Router();
const passport = require('passport');

const ambulanceController = require('../controller/ambulance_controller.js');

router.get('/nearby-hospitals', passport.checkAmbulanceDriver, ambulanceController.nearby_hospitals);

module.exports = router;