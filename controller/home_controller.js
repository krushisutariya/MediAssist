const contact_mailer = require('../mailers/contacts');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports.home = async function(req, res){
   
    return res.render('home', {
        title: "MediAssist | Home"
    });
}

module.exports.about = function(req, res){
    return res.render('about', {
        title: "MediAssist | About"
    });
}

module.exports.contact = function(req, res){
    return res.render('contact', {
        title: "MediAssist | Contact US"
    });
}

module.exports.team = function(req,res){
    return res.render('team', {
        title: "MediAssist | Team"
    });
}

module.exports.submit_contact = async function(req, res){
    
    try{

        if(!req.user){
            req.flash('error', 'You need to Login to send the Mail!');
            return res.redirect('back');
        }
        
        let user = await pool.query(`select email, name from users where email = $1`, [req.user.email]);
        user = user.rows[0];
        contact_mailer.contact(user, req.body.subject, req.body.message);

        return res.redirect('back');

    } catch(err){
        console.log('Error: ', err);
    }
    
}