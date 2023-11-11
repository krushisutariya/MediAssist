const express = require('express');
const router = express.Router();
const passport = require('passport');

const patientController = require('../controller/patient_controller.js');

// router.get('/find-hospitals-doctors', patientController.find_hospitals_doctors);


module.exports = router;