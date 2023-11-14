const express = require('express');
const router = express.Router();
const passport = require('passport');

const govtAgencyController = require('../controller/govt_agency_controller.js');

router.get('/doctors', passport.checkGovtAgency, govtAgencyController.doctors);
router.get('/hospitals', passport.checkGovtAgency, govtAgencyController.hospitals);


module.exports = router;