const pool = require('../config/db');

// Render the Add Pharmacy page
module.exports.add_pharma = function(req, res){
    return res.render('add-pharma', {
        title: 'Add Pharma'
    });
}

// Render the Add Laboratory page
module.exports.add_lab = function(req, res){
    return res.render('add-lab', {
        title: 'Add Lab'
    });
}

// Register a new Pharmacy
module.exports.register_pharma = async function(req, res){
    
    // You have the data in req.body and can access it like this: req.body.detail_you_want. Make an INSERT query into the Pharmacy table using this data.
    // Write the query in the backticks below
    let data = await pool.query(``);

    req.flash('success', 'Pharmacy added successfully');
    return res.redirect('/');
}

// Register a new Laboratory
module.exports.register_lab = async function(req, res){
    
    // You have the data in req.body and can access it like this: req.body.detail_you_want. Make an INSERT query into the Pharmacy table using this data.
    // Write the query in the backticks below
    let data = await pool.query(``);

    req.flash('success', 'Laboratory added successfully');
    return res.redirect('/');
}

// Render the upcoming appointments page
module.exports.appointments = async (req, res) => {
    try {
        
        // Find out the doctors that are enrolled in the hospital using the works table
        let doctors = await pool.query(``);
        doctors = doctors.rows;
        let appointments = [];

        doctors.forEach(async (doctor) => {

            // Find out the appointments taken by the doctors of the hospitals using the details from appoints table
            let appointment = await pool.query(``);
            appointment = appointment.rows;
            appointments.push(...appointment);

        });
        return res.render('hospital_appointments', {
            title: 'Appointments',
            appointments: appointments
        })
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}

// Register a new Doctor at the hospital
module.exports.register_doctor = async (req, res) => {
    try {
        // You have the data in req.body and can access it like this: req.body.detail_you_want. Make an INSERT query into the Doctor table using this data.
        // Write the query in the backticks below
        await pool.query(``);

        req.flash('success', 'Doctor added successfully');
        return res.redirect('/');

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}

module.exports.manage_patients = async (req, res) => {
    try {
        
        // Find out the patients that are enrolled in the hospital using the doctors details from the appoints table
        let doctors = await pool.query(``);
        doctors = doctors.rows;
        let patients = [];

        doctors.forEach(async (doctor) => {

            // Find out the patients that are enrolled in the hospital using the doctors details from the appoints table
            let patient = await pool.query(``);
            patient = patient.rows;
            patients.push(...patient);

        });

        return res.render('hospital_manage_patients', {
            title: 'Manage Patients',
            patients: patients
        })
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}

// Cancel an appointment
module.exports.cancel_appointment = async (req, res) => {
    try {
        const { id } = req.params;
        // Given the appointment id, delete the appointment from the appoints table
        await pool.query(``);

        req.flash('success', 'Appointment cancelled successfully');
        return res.redirect('back');
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}