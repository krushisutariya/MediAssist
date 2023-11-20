const express = require('express');
const router = express.Router();
const passport = require('passport');

const patientController = require('../controller/patient_controller.js');

router.get('/find-hospitals-doctors', passport.checkPatient, patientController.find_hospitals_doctors);
router.get('/check-slots/:email', passport.checkPatient, patientController.check_slots);
router.post('/check-availability/:email', passport.checkPatient, patientController.check_availability);
router.post('/make-appointment', passport.checkPatient, patientController.make_appointment);
router.get('/track-appointment', passport.checkPatient, patientController.track_appointment);
router.get('/cancel-appointment/:id', passport.checkPatient, patientController.cancel_appointment);

module.exports = router;