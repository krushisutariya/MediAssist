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

// // Profile section for User
// module.exports.profile = async function (req, res) {
//     try {
//         let user = await User.findById(req.params.id);

//         if (user.role == 'practitioner') {
//             user = await Practioner.findOne({ user: req.params.id });
//         } else {
//             user = await Patient.findOne({ user: req.params.id });
//         }

//         return res.render('profile', {
//             title: "MediAssist | Profile",
//             user: user
//         });

//     } catch (err) {
//         if (err) {
//             console.log('Error in finding the user!');
//             req.flash('error', err);
//             return res.redirect('back');
//         }
//     }

// }

// // Update Profile for User
// module.exports.update_profile = async function (req, res) {
//     if (req.params.id = req.user.id) {
//         try {
//             let user = await User.findById(req.params.id);
//             if (user.role == 'patient') {
//                 user = await Patient.findOne({ user: req.params.id });
//                 user.name = req.body.name;
//                 user.email = req.body.email;
//                 user.username = req.body.username;
//                 user.gender = req.body.gender;
//                 user.weight = req.body.weight;
//                 user.height = req.body.height;
//                 user.birth_date = req.body.birth_date;
//                 console.log(user.birth_date);
//                 user.contact = req.body.contact;
//                 user.address = req.body.address;
//                 user.history = req.body.history;
//                 user.save();
//             } else {
//                 user = await Practioner.findOne({ user: req.params.id });
//                 user.name = req.body.name;
//                 user.email = req.body.email;
//                 user.username = req.body.username;
//                 user.gender = req.body.gender;
//                 user.qualification = req.body.qualification;
//                 user.specialization = req.body.specialization;
//                 user.experience = req.body.experience;
//                 user.contact = req.body.contact;
//                 user.address = req.body.address;
//                 user.fees = req.body.fees;
//                 user.opening_time = req.body.opening_time;
//                 user.closing_time = req.body.closing_time;
//                 user.save();
//             }
//             req.flash('success', 'Profile Updated Successfully!');
//             return res.redirect('back');

//         } catch (err) {
//             req.flash('error', err);
//             console.log('Error: ', err);
//         }
//     } else {
//         return res.status(401).send('Unauthorized User');
//     }
// }

// // Destroy Session for User
// module.exports.clear_session = function (req, res) {
//     req.logout(function (err) {
//         if (err) {
//             req.flash('err', 'Error while Logging Out!');
//             return res.redirect('back');
//         }
//         req.flash('success', 'Logged Out Successfully!');
//         res.redirect('/');
//     });
// }