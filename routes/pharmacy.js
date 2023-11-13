const express = require('express');
const router = express.Router();
const passport = require('passport');

const pharmacyController = require('../controller/pharmacy_controller.js');

router.get('/manage-inventory', pharmacyController.stocks);
router.get('/update-stocks', pharmacyController.update_stocks);
router.post('/update-medicine-stocks/:email', pharmacyController.update_medicine_stocks);
router.post('/add-medicine', pharmacyController.add_medicine);

module.exports = router;