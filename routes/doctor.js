const express = require('express');
const router = express.Router();
const passport = require('passport');

const doctorController = require('../controller/doctor_controller.js');

router.get('/scheduled-appointment', doctorController.upcoming_appointments);
router.get('/track-appointment', doctorController.past_appointments);
router.get('/appointment/:id', doctorController.open_appointment);
router.post('/update-appointment/:id', doctorController.update_appointment)

module.exports = router;