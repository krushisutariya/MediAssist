const express = require('express');
const router = express.Router();
const passport = require('passport');

const hospitalController = require('../controller/hospital_controller.js');

router.get('/add-pharma', hospitalController.add_pharma);
router.get('/add-lab', hospitalController.add_lab);
router.post('/register-pharma/:email', hospitalController.register_pharma);
router.post('/register-lab/:email', hospitalController.register_lab);
router.post('/register-doctor/:email', hospitalController.register_doctor);
router.get('/view-doctors', hospitalController.view_doctors);
router.get('/add-doctor', hospitalController.add_doctor);
router.get('/view-appointment', hospitalController.appointments);
router.get('/cancel-appointment/:id', hospitalController.cancel_appointment);

module.exports = router;