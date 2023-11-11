const express = require('express');
const router = express.Router();
const passport = require('passport');

const govtAgencyController = require('../controller/govt_agency_controller.js');

router.get('/doctors', govtAgencyController.doctors);
router.get('/hospitals', govtAgencyController.hospitals);


module.exports = router;