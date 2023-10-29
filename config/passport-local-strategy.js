const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/db');

passport.use('local', new LocalStrategy({
    usernameField: 'email_username',
    passReqToCallback: true
}, async function (req, email_username, password, done) {
        
    try {
        
        const rows = await pool.query('SELECT * FROM Users WHERE email = $1 OR username = $1', [email_username]);
        const user = rows.rows[0];

        if(!user || user.password != password){
            req.flash('error', 'Invalid Username/Password');
            return done(null, false);
        }

        // User authenticated, set req.user and return it
        req.user = user;
        return done(null, user);

    } catch (error) {
        console.log('Error encountered while finding the user:', error);
        return done(error);
    }

}));

// using authentication as middleware 
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // If the user is authenticated, set res.locals.user
        res.locals.user = req.user;
    }
    next();
};

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    done(null, user.email);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (email, done) {
    try {
        const rows = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        const user = await rows.rows[0];
        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.log('Error while deserializing the users:', error);
        return done(error);
    }
});

// verifying if the user is authentic
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        // if the user is authenticated then proceed him from the sign in page
        return next();
    }
    // if the user is not authenticated then send him back to the sign in page
    return res.redirect('/users/sign-in');
}

// check if the user is a builder

passport.checkPatient = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role == 'patient'){

            return next();
        }
        return res.redirect('back');
    }
    return res.redirect('/users/sign-in');
}

// check if the user is a Doctor
passport.checkDoctor = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'doctor') {
            return next();
        }
        return res.redirect('back');
    }
    return res.redirect('/users/sign-in');
}

// check if user is a builder or a Doctor
passport.checkPatientDoctor = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'doctor' || req.user.role == 'patient') {
            return next();
        }
        return res.redirect('back');
    }
    return res.redirect('/users/sign-in');
}

module.exports = passport;