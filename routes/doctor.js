const express = require('express');
const router = express.Router();
const passport = require('passport');

const doctorController = require('../controller/doctor_controller.js');

router.get('/scheduled-appointment', passport.checkDoctor, doctorController.upcoming_appointments);
router.get('/track-appointment', passport.checkDoctor, doctorController.past_appointments);
router.get('/appointment/:id', passport.checkDoctor, doctorController.open_appointment);
router.post('/update-appointment/:id', passport.checkDoctor, doctorController.update_appointment)

module.exports = router;