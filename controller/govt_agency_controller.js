const pool = require('../config/db');

// Rendering the page for displaying doctor's name, email, contact and reg_no
module.exports.doctors = async (req, res) => {
    try {
        let doctors = await pool.query(`select name, email, contact, reg_no, specialization
                                        from doctor
                                        order by name`);
        doctors = doctors.rows;

        return res.render('govt_agency-doctor', {
            title: 'Doctors',
            doctors: doctors
        });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({error: 'Server Error!'});
    }
}

// Rendering the page for displaying hospital's name, specialization, total beds and total staff at the hospital
module.exports.hospitals = async (req, res) => {
    try {
        let hospitals = await pool.query(`SELECT 
        name, 
        email, 
        specialities, 
        (icu + iicu + operation_theatre + general_ward) AS total_beds,
        (nurse + intern + ot_technician) AS total_staff
    FROM 
        hospital
    ORDER BY 
        name;
    `);
        hospitals = hospitals.rows;
          
        return res.render('govt_agency-hospital', {
            title: 'Hospitals',
            hospitals: hospitals
        });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({error: 'Server Error!'});
    }
}