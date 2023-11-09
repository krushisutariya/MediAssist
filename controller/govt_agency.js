const pool = require('../config/db');

// Rendering the page for displaying doctor's name, email, contact and reg_no
module.exports.doctors = async (req, res) => {
    try {
        let doctors = await pool.query(``);
        doctors = doctors.rows;

        return res.render('govt_agency_doctors', {
            title: 'Doctors',
            doctors: doctors
        });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({error: 'Server Error!'});
    }
}

// Rendering the page for displaying hospital's name, specialization, contacts, total beds and total staff at the hospital
module.exports.hospitals = async (req, res) => {
    try {
        let hospitals = await pool.query(``);
        hospitals = hospitals.rows;

        return res.render('govt_agency_hospitals', {
            title: 'Hospitals',
            hospitals: hospitals
        });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({error: 'Server Error!'});
    }
}