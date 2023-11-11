const pool = require('../config/db');

// Render the appointment booking page
module.exports.appointment = async (req, res) => {
    
}

// Make an appointment
module.exports.make_appointment = async (req, res) => {
    try {
        
        // Generating 15digits id with current date and time so that each appointment id is unique
        // assuming that no two appointments are booked at the same time
        const currentDate = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = currentDate.toLocaleDateString('en-IN', options).replace(/\//g, '');
        const formattedTime = currentDate.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }).replace(/:/g, '');
        const formattedDateTime = `${formattedDate}T${formattedTime}`;

        const id = formattedDateTime; // I will generate unique id using any predefined functions

        // Insertion query into the appoints table
        // start_time, end_time, date, doctor_email, etc all in req.body and patient email in req.user.email
        // keep the is_pending bit as 1
        await pool.query(`insert into appoints(id,patient_email,doc_email,start_time,end_time,date,is_pending) values ($1, $2, $3, $4, $5, $6, '1')`, [id, req.user.email, req.body.doc_email, req.body.start_time, req.body.end_time, req.body.date]);

        req.flash('success', 'Appointment booked successfully');
        return res.redirect('/');
        
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({error: 'Server Error!'});
    }
}

module.exports.track_appointment = async (req, res) => {
    try {
        // given the patient's email in req.user.email, find out the appointments booked by the patients
        // All the appointments, i.e., pending bit 0 as well as 1
        // write two diiferent different queries for upcoming and past appointments
        
        let upcoming_appointments = await pool.query(`select * from appoints where patient_email=$1 && is_pending =0`,[req.user.email]);
        upcoming_appointments = upcoming_appointments.rows;

        let past_appointments = await pool.query(`select * from appoints where patient_email=$1 && is_pending =1`,[req.user.email]);
        past_appointments = past_appointments.rows;
       //
        return res.render('patient-appointments', {
            title: 'Appointments',
            upcoming_appointments: upcoming_appointments,
            past_appointments: past_appointments
        });

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({error: 'Server Error!'});
    }
}