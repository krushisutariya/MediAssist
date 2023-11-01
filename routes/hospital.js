const express = require('express');
const router = express.Router();
const passport = require('passport');

const hospitalController = require('../controller/hospital_controller.js');

router.get('/add-pharma', hospitalController.add_pharma);
router.get('/add-lab', hospitalController.add_lab);
router.post('/register-pharma', hospitalController.register_pharma);
router.post('/register-lab', hospitalController.register_lab);

module.exports = router;