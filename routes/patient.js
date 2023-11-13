const express = require('express');
const router = express.Router();
const passport = require('passport');

const patientController = require('../controller/patient_controller.js');

router.get('/find-hospitals-doctors', patientController.find_hospitals_doctors);
router.get('/check-slots/:email', patientController.check_slots);
router.post('/check-availability/:email', patientController.check_availability);
router.post('/make-appointment', patientController.make_appointment);
router.get('/track-appointment', patientController.track_appointment);


module.exports = router;