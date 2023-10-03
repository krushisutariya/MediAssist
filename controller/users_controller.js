const { query } = require('express');
const pool = require('../config/db');

// Sign-In Page Rendering
module.exports.sign_in = function (req, res) {
    return res.render('sign_in', {
        title: "MediAssist | Sign In"
    });
}

// Create Session for Verified User
module.exports.create_session = function (req, res) {
    req.flash('success', 'Logged In Successfully!');
    return res.redirect('/');
}

module.exports.details = function (req, res) {
    return res.render('appointment_display', {
        title: "Appointment Details",
    });
}

// Register New User
// module.exports.new_user = async function (req, res) {
//     if (req.body.re_password != req.body.password) {
//         req.flash('error', 'Passwords are not matching');
//         return res.redirect('back');
//     }
//     let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
//     console.log('Finding user:', user);
//     if (!user) {
//         try {
//             user = await User.create(req.body);
//             console.log('Creating user');
//             if (req.body.role == 'practitioner') {
//                 console.log('Creating Practitioner: ', user._id, user.name, user.username, user.email, user.password, user.role);
//                 await Practioner.create({
//                     user: user._id,
//                     name: user.name,
//                     username: user.username,
//                     email: user.email,
//                     password: user.password,
//                     role: user.role
//                 });
//             } else {
//                 await Patient.create({
//                     user: user._id,
//                     name: user.name,
//                     username: user.username,
//                     email: user.email,
//                     password: user.password,
//                     role: user.role
//                 });
//             }

//             req.flash('success', 'User Registered Successfully!');
//             return res.redirect('/users/sign-in');
//         } catch (err) {
//             req.flash('error', err);
//             console.log('Error: ', err);
//         }
//     } else {
//         req.flash('error', 'User already exists!');
//         return res.render('sign_in', {
//             title: "MediAssist | Sign In"
//         });
//     }
// }

// Profile section for User
module.exports.profile = async function (req, res) {
    try {
        const mode = await pool.query('SELECT * FROM Users WHERE id = $1', [req.params.id]);
        const rows = mode.rows[0];
        const user = await pool.query(`SELECT * FROM ${rows.role} WHERE email = $1`, [rows.email]);

        return res.render('profile', {
            title: "MediAssist | Profile",
            user: user.rows[0],
            mode: rows,
        });

    } catch (err) {
        if (err) {
            console.log('Error in finding the user: ', err);
            req.flash('error', err);
            return res.redirect('back');
        }
    }

}

// Update Profile for User
module.exports.update_profile = async function (req, res) {
    if (req.params.id == req.user.id) {
        try {
            let user = await pool.query('SELECT * FROM Users WHERE id = $1', [req.params.id]);
            user = user.rows[0];
            
            if (user.role == 'Patient') {
                await pool.query('UPDATE Users SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Patient SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Patient SET gender = $1 WHERE email = $2', [req.body.gender, user.email]);
                await pool.query('UPDATE Patient SET weight = $1 WHERE email = $2', [parseFloat(req.body.weight), user.email]);
                await pool.query('UPDATE Patient SET height = $1 WHERE email = $2', [parseFloat(req.body.height), user.email]);
                await pool.query('UPDATE Patient SET diseases = $1 WHERE email = $2', [req.body.diseases, user.email]);
                await pool.query('UPDATE Patient SET blood_group = $1 WHERE email = $2', [req.body.blood_group, user.email]);
                await pool.query('UPDATE Patient SET birth_date = $1 WHERE email = $2', [req.body.birth_date, user.email]);
                await pool.query('UPDATE Patient SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);
                await pool.query('UPDATE Patient SET address = $1 WHERE email = $2', [req.body.address, user.email]);
            } else {
                // user = await Practioner.findOne({ user: req.params.id });
                // user.name = req.body.name;
                // user.email = req.body.email;
                // user.username = req.body.username;
                // user.gender = req.body.gender;
                // user.qualification = req.body.qualification;
                // user.specialization = req.body.specialization;
                // user.experience = req.body.experience;
                // user.contact = req.body.contact;
                // user.address = req.body.address;
                // user.fees = req.body.fees;
                // user.opening_time = req.body.opening_time;
                // user.closing_time = req.body.closing_time;
                // user.save();
            }
            req.flash('success', 'Profile Updated Successfully!');
            return res.redirect('back');

        } catch (err) {
            req.flash('error', err);
            console.log('Error: ', err);
        }
    } else {
        return res.status(401).send('Unauthorized User');
    }
}

// Destroy Session for User
module.exports.clear_session = function (req, res) {
    req.logout(function (err) {
        if (err) {
            req.flash('err', 'Error while Logging Out!');
            return res.redirect('back');
        }
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/');
    });
}