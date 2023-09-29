const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const pool = require('../config/db');
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

passport.use(new JWTStrategy(opts, async function(jwt_payload, done){

    try {
        console.log('JWT Payload:', jwt_payload);
        const rows = await pool.query('SELECT * FROM Users WHERE id = $1', [jwt_payload._id]);
        const user = rows.rows[0];
        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.log('Error while deserializing the users:', error);
        return done(error);
    }

}));

module.exports = passport;