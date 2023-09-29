const express = require('express');
const router = express.Router();
const passport = require('passport');

//accessing the controller folder
const usersController = require('../controller/users_controller');

// Router-Controller cycle
router.get('/sign-in', usersController.sign_in); //redirected to controller rendering sign-in page
router.get('/sign-up', usersController.sign_up); //redirected to controller rendering sign-up page
router.get('/sign-out', passport.checkPatientPractitioner, usersController.clear_session); //redirected to controller signing out user
router.get('/profile/:id', passport.checkPatientPractitioner, usersController.profile); //redirected to controller signing out user
router.post('/update-profile/:id', passport.checkPatientPractitioner, usersController.update_profile); //redirected to controller updating user profile
router.use('/appointment', require('./appointment')); //redirected to controller rendering users page

router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in' }
), usersController.create_session); //redirected to controller creating session for verified user

// router.post('/create-session-user', passport.authenticate('local-user', {
//     failureRedirect: '/users/sign-in'
// }), usersController.create_session); //redirected to controller creating session for verified user

// // For practitioner login
// router.post('/create-session-practitioner', passport.authenticate('local-practitioner', {
//     failureRedirect: '/users/sign-in'
// }), usersController.create_session); //redirected to controller creating session for verified user

router.post('/new-user', usersController.new_user); //redirected to controller registering new user
//
router.get('/details',usersController.details);
//
module.exports = router;