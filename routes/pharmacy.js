const express = require('express');
const router = express.Router();
const passport = require('passport');

const pharmacyController = require('../controller/pharmacy_controller.js');

router.get('/manage-inventory', passport.checkPharmacy, pharmacyController.stocks);
router.get('/update-stocks', passport.checkPharmacy, pharmacyController.update_stocks);
router.post('/update-medicine-stocks/:email', passport.checkPharmacy, pharmacyController.update_medicine_stocks);
router.post('/add-medicine', passport.checkPharmacy, pharmacyController.add_medicine);

module.exports = router;