const User = require('../models/user');
// const contact_mailer = require('../mailers/contact');

module.exports.home = function(req, res){
    return res.render('home', {
        title: "{NAME} Clinics"
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

module.exports.doctors = function(req,res){
    return res.render('doctors', {
        title: "MediAssist | Doctors"
    });
}

module.exports.submit_contact = async function(req, res){
    
    try{

        if(!req.user){
            req.flash('error', 'You need to Login to send the Mail!');
            return res.redirect('back');
        }
        
        let user = await User.findOne({email: req.body.email})
        .populate('email', 'name');

        contact_mailer.contact(user, req.body.subject, req.body.message);

        return res.redirect('back');

    } catch(err){
        console.log('Error: ', err);
    }
    
}