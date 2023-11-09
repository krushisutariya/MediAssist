const express = require('express');
const router = express.Router();
const passport = require('passport');

// accessing the controller folder
const usersController = require('../controller/users_controller');

// Router-Controller cycle
router.get('/sign-in', usersController.sign_in); //redirected to controller rendering sign-in page
router.get('/sign-out', usersController.clear_session); //redirected to controller signing out user
router.get('/profile/:email', usersController.profile); //redirected to controller signing out user
router.post('/update-profile/:email', usersController.update_profile); //redirected to controller updating user profile

router.use('/hospital', require('./hospital')); //redirected to controller rendering hospital page
router.use('/doctor', require('./doctor')); //redirected to controller rendering doctor page
router.use('/pharmacy', require('./pharmacy')); //redirected to controller rendering pharmacy page

router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in' }
), usersController.create_session); //redirected to controller creating session for verified user

// router.post('/new-user', usersController.new_user); //redirected to controller registering new user
//
// router.get('/details',usersController.details);
//

module.exports = router;