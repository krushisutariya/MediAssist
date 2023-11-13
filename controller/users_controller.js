const { query } = require('express');
const pool = require('../config/db');
const e = require('connect-flash');

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
    if(req.params.email === req.user.email) {
        try {
            const mode = await pool.query('SELECT * FROM Users WHERE email = $1', [req.params.email]);
            const rows = mode.rows[0];
            var user = await pool.query(`SELECT * FROM ${rows.role} WHERE email = $1`, [rows.email]);
            user = user.rows[0];
            
            // Hospital's Profile
            var contact = null;
            if(rows.role === 'Hospital') {
                contact = await pool.query(`SELECT * FROM Hospital_Contact WHERE email = $1`, [rows.email]);
                if(contact) {
                    contact = contact.rows;
                } else {
                    contact = null;
                }
                var total_doctors = null;
                // var total_doctors = await pool.query(`SELECT count(doc_email) FROM works WHERE hosp_email = ${rows.email}`);
                return res.render('profile', {
                    title: "MediAssist | Profile",
                    user: user,
                    mode: rows,
                    contact: contact,
                    total_doctors: total_doctors
                });
            }
    
            // Doctor's Profile
            if(rows.role === 'Doctor') {
                console.log('Entered Doctors section');
                var start_time = await pool.query(`SELECT start_time FROM works WHERE doc_email = $1`, [rows.email]);
                var end_time = await pool.query(`SELECT end_time FROM works WHERE doc_email = $1`, [rows.email]);
                var salary = await pool.query(`SELECT salary FROM works WHERE doc_email = $1`, [rows.email]);
                var hosp = await pool.query(`SELECT hosp_email FROM works WHERE doc_email = $1`, [rows.email]);
                hosp = await pool.query(`SELECT name FROM Hospital WHERE email = $1`, [hosp.rows[0].hosp_email]);
    
                return res.render('profile', {
                    title: "MediAssist | Profile",
                    user: user,
                    mode: rows,
                    start_time: start_time.rows[0].start_time,
                    end_time: end_time.rows[0].end_time,
                    salary: salary.rows[0].salary,
                    hospital: hosp.rows[0].name
                });
            }
    
            // Pharmacy Profile
            if(rows.role === 'Pharmacy' || rows.role === 'Laboratory') {
    
                var hospital = await pool.query("SELECT name FROM Hospital WHERE TRIM(email) = $1", [user.email_hospital.trim()]);
    
                return res.render('profile', {
                    title: "MediAssist | Profile",
                    user: user,
                    mode: rows,
                    hospital: hospital.rows[0].name
                });
            }

            return res.render('profile', {
                title: "MediAssist | Profile",
                user: user,
                mode: rows,
            });
    
        } catch (err) {
            if (err) {
                console.log('Error in finding the user: ', err);
                req.flash('error', err);
                return res.redirect('back');
            }
        }
    } else {
        return res.status(401).send('Unauthorized User');
    }    

}

// Update Profile for User
module.exports.update_profile = async function (req, res) {
    if (req.params.email === req.user.email) {
        try {
            let user = await pool.query('SELECT * FROM Users WHERE email = $1', [req.params.email]);
            user = user.rows[0];
            
            // Update Patient
            if (user.role === 'Patient') {

                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Patient SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Patient SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Patient SET gender = $1 WHERE email = $2', [req.body.gender, user.email]);
                await pool.query('UPDATE Patient SET location = $1 WHERE email = $2', [req.body.location, user.email]);
                await pool.query('UPDATE Patient SET weight = $1 WHERE email = $2', [parseFloat(req.body.weight), user.email]);
                await pool.query('UPDATE Patient SET height = $1 WHERE email = $2', [parseFloat(req.body.height), user.email]);
                await pool.query('UPDATE Patient SET diseases = $1 WHERE email = $2', [req.body.diseases, user.email]);
                await pool.query('UPDATE Patient SET blood_group = $1 WHERE email = $2', [req.body.blood_group, user.email]);
                await pool.query('UPDATE Patient SET birth_date = $1 WHERE email = $2', [req.body.birth_date, user.email]);
                await pool.query('UPDATE Patient SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);
                await pool.query('UPDATE Patient SET address = $1 WHERE email = $2', [req.body.address, user.email]);
            
            } else if(user.role === 'Doctor') {

                // Update Doctor

                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Doctor SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Doctor SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Doctor SET reg_no = $1 WHERE email = $2', [req.body.reg_no, user.email]);
                await pool.query('UPDATE Doctor SET address = $1 WHERE email = $2', [req.body.address, user.email]);
                await pool.query('UPDATE Doctor SET gender = $1 WHERE email = $2', [req.body.gender, user.email]);
                await pool.query('UPDATE Doctor SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);
                await pool.query('UPDATE Doctor SET specialization = $1 WHERE email = $2', [req.body.specialization, user.email]);
                await pool.query('UPDATE Doctor SET experience = $1 WHERE email = $2', [req.body.experience, user.email]);
                await pool.query('UPDATE Doctor SET qualification = $1 WHERE email = $2', [req.body.qualification, user.email]);
                await pool.query('UPDATE Doctor SET institute = $1 WHERE email = $2', [req.body.institute, user.email]);
                await pool.query(`UPDATE works SET start_time = $1 where doc_email = $2`, [req.body.start_time, user.email]);
                await pool.query(`UPDATE works SET end_time = $1 where doc_email = $2`, [req.body.end_time, user.email]);

            } else if (user.role === 'Hospital') {
                
            // Update Hospital
                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Hospital SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Hospital SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Hospital SET address = $1 WHERE email = $2', [req.body.address, user.email]);
                await pool.query('UPDATE Hospital SET specialities = $1 WHERE email = $2', [req.body.specialities, user.email]);
                await pool.query('UPDATE Hospital SET location = $1 WHERE email = $2', [req.body.location, user.email]);
                await pool.query('UPDATE Hospital SET insurance_policies = $1 WHERE email = $2', [req.body.insurance_policies, user.email]);
                await pool.query('UPDATE Hospital SET cashless = $1 WHERE email = $2', [req.body.cashless, user.email]);

                // Contact Data
                var areContactsThere = await pool.query('SELECT * FROM Hospital_Contact WHERE email = $1', [user.email]);
                if(areContactsThere.rows.length == 0) {
                    if(req.body.contact1 != null && req.body.contact1 != '') {
                        await pool.query('INSERT INTO Hospital_Contact (email, contact, index) VALUES ($1, $2, $3)', [user.email, req.body.contact1, 1]);
                    } else {
                        await pool.query('INSERT INTO Hospital_Contact (email, contact, index) VALUES ($1, $2, $3)', [user.email, 'Contact-1', 1]);
                    }
                    if(req.body.contact2 != null && req.body.contact2 != '') {
                        await pool.query('INSERT INTO Hospital_Contact (email, contact, index) VALUES ($1, $2, $3)', [user.email, req.body.contact2, 2]);
                    } else {
                        await pool.query('INSERT INTO Hospital_Contact (email, contact, index) VALUES ($1, $2, $3)', [user.email, 'Contact-2', 2]);
                    }
                    if(req.body.landline != null && req.body.landline != '') {
                        await pool.query('INSERT INTO Hospital_Contact (email, contact, index) VALUES ($1, $2, $3)', [user.email, req.body.landline, 3]);
                    } else {
                        await pool.query('INSERT INTO Hospital_Contact (email, contact, index) VALUES ($1, $2, $3)', [user.email, 'Landline', 3]);
                    }
                } else {
                    await pool.query('UPDATE Hospital_Contact SET contact = $1 WHERE email = $2 AND index = $3', [(req.body.contact1)?req.body.contact1:'Contact-1', user.email, 1]);
                    await pool.query('UPDATE Hospital_Contact SET contact = $1 WHERE email = $2 AND index = $3', [(req.body.contact2)?req.body.contact2:'Contact-2', user.email, 2]);
                    await pool.query('UPDATE Hospital_Contact SET contact = $1 WHERE email = $2 AND index = $3', [(req.body.landline)?req.body.landline:'Landline', user.email, 3]);
                }

                // Beds Data
                await pool.query('UPDATE Hospital SET icu = $1 WHERE email = $2', [(req.body.icu === null || req.body.icu === '') ? 999 : parseFloat(req.body.icu), user.email]);
                await pool.query('UPDATE Hospital SET iicu = $1 WHERE email = $2', [(req.body.iicu === null || req.body.iicu === '') ? 999 : parseFloat(req.body.iicu), user.email]);
                await pool.query('UPDATE Hospital SET operation_theatres = $1 WHERE email = $2', [(req.body.operation_theatres === null || req.body.operation_theatres === '') ? 999 : parseFloat(req.body.operation_theatres), user.email]);
                await pool.query('UPDATE Hospital SET general_ward = $1 WHERE email = $2', [(req.body.general_ward === null || req.body.general_ward === '') ? 999 : parseFloat(req.body.general_ward), user.email]);

                // Staff
                await pool.query('UPDATE Hospital SET nurse = $1 WHERE email = $2', [(req.body.nurse === null || req.body.nurse === '') ? 999 : parseFloat(req.body.nurse), user.email]);
                await pool.query('UPDATE Hospital SET interns = $1 WHERE email = $2', [(req.body.interns === null || req.body.interns === '') ? 999 : parseFloat(req.body.interns), user.email]);
                await pool.query('UPDATE Hospital SET ot_technicians = $1 WHERE email = $2', [(req.body.ot_technicians === null || req.body.ot_technicians === '') ? 999 : parseFloat(req.body.ot_technicians), user.email]);
            
            } else if(user.role === 'Pharmacy'){

            // Update Pharmacy

                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Pharmacy SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Pharmacy SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Pharmacy SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);

            } else if(user.role === 'Laboratory'){

                // Update Laboratory
    
                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Laboratory SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Laboratory SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Laboratory SET instruments = $1 WHERE email = $2', [req.body.instruments, user.email]);
                await pool.query('UPDATE Laboratory SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);
    
            } else if(user.role === 'Govt_Agency'){

                // Update Government Agency
    
                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Govt_agency SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Govt_agency SET id = $1 WHERE email = $2', [req.body.id, user.email]);
                await pool.query('UPDATE Govt_agency SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Govt_agency SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);

            } else if(user.role === 'Ambulance_driver'){

                // Update Pharmacy

                await pool.query(`UPDATE Users SET username = $1 WHERE email = $2`, [req.body.username, user.email]);
                await pool.query('UPDATE Ambulance_driver SET username = $1 WHERE email = $2', [req.body.username, user.email]);
                await pool.query('UPDATE Ambulance_driver SET name = $1 WHERE email = $2', [req.body.name, user.email]);
                await pool.query('UPDATE Ambulance_driver SET address = $1 WHERE email = $2', [req.body.address, user.email]);
                await pool.query('UPDATE Ambulance_driver SET licence = $1 WHERE email = $2', [req.body.licence, user.email]);
                await pool.query('UPDATE Ambulance_driver SET vehicle_number = $1 WHERE email = $2', [req.body.vehicle_number, user.email]);
                await pool.query('UPDATE Ambulance_driver SET contact = $1 WHERE email = $2', [req.body.contact, user.email]);

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