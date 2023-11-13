const express = require('express');
const router = express.Router();

//accessing the controller folder
const homeController = require('../controller/home_controller');
// const passport = require('passport');

// Router-Controller cycle
router.get('/', homeController.home); //redirected to controller rendering home page
router.get('/about', homeController.about); //redirected to controller rendering about page
router.get('/contact', homeController.contact); //redirected to controller rendering contact page
router.get('/doctors',homeController.doctors); //redirected to controller rendering doctors page
// router.post('/submit-mail', passport.checkPatientPractitioner, homeController.submit_contact); //redirected to controller rendering contact page
router.use('/users', require('./users')); //redirected to controller rendering users page
// router.use('/functionality', require('./functionality')); //redirected to controller rendering functionality page
// router.use('/project', require('./project')); //redirected to controller rendering projects page
router.get('/getApiKey', (req, res) => {
    res.json({ apiKey: process.env.apiKey });
});


module.exports = router;