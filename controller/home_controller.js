// const contact_mailer = require('../mailers/contact');
const pool = require('../config/db');

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

module.exports.doctors = function(req,res){
    return res.render('doctors', {
        title: "MediAssist | Doctors"
    });
}

// module.exports.submit_contact = async function(req, res){
    
//     try{

//         if(!req.user){
//             req.flash('error', 'You need to Login to send the Mail!');
//             return res.redirect('back');
//         }
        
//         let user = await User.findOne({email: req.body.email})
//         .populate('email', 'name');

//         contact_mailer.contact(user, req.body.subject, req.body.message);

//         return res.redirect('back');

//     } catch(err){
//         console.log('Error: ', err);
//     }
    
// }