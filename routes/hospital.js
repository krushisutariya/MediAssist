const express = require('express');
const router = express.Router();
const passport = require('passport');

const hospitalController = require('../controller/hospital_controller.js');

router.get('/add-pharma', passport.checkHospital, hospitalController.add_pharma);
router.get('/add-lab', hospitalController.add_lab);
router.post('/register-pharma/:email', passport.checkHospital, hospitalController.register_pharma);
router.post('/register-lab/:email', passport.checkHospital, hospitalController.register_lab);
router.post('/register-doctor/:email', passport.checkHospital, hospitalController.register_doctor);
router.get('/view-doctors', passport.checkHospital, hospitalController.view_doctors);
router.get('/view-patients', passport.checkHospital, hospitalController.manage_patients);
router.get('/add-doctor', passport.checkHospital, hospitalController.add_doctor);
router.get('/view-appointment', passport.checkHospital, hospitalController.appointments);
router.get('/cancel-appointment/:id', passport.checkHospital, hospitalController.cancel_appointment);

module.exports = router;