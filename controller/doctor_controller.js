const pool = require('../config/db');

// Render the Upcoming Appointments page
module.exports.upcoming_appointments = async (req, res) => {
    try {
        // Find out those appointments that are not cancelled and are not completed,i.e., is_pending bit is 1; from the appoints table
        let appointment = await pool.query(``);
        appointment = appointment.rows;    

        return res.render('doctor_upcoming_appointments', {
            title: 'Upcoming Appointments',
            appointments: appointment
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}

// Render the Past Appointments page
module.exports.past_appointments = async (req, res) => {
    try {
        // Find out those appointments that are completed,i.e., is_pending bit is 0; from the appoints table
        let appointment = await pool.query(``);
        appointment = appointment.rows;    

        return res.render('doctor_past_appointments', {
            title: 'Past Appointments',
            appointments: appointment
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}

// Cancel an appointment
module.exports.open_appointment = async (req, res) => {
    try {
        const { id } = req.params;
        // Given the appointment id, fetch the appointment details from the appoints table, i.e., the patient name, doctor name, date, time, etc.
        // You can use multiple queries to fetch the desired results like using doctors table for fetching the name of the doctor from 
        // the doctor's table but make sure you fetch it by making variables with appropriate names like doctor_name, patient_name, etc.

        let appointment = await pool.query(``);
        appointment = appointment.rows[0];

        return res.render('doctor_open_appointment', {
            title: 'Edit Appointment',
            appointment: appointment
        })

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}

// Update an appointment
module.exports.update_appointment = async (req, res) => {
    try {
        
        // update the is_pending bit to 0 in the appoints table for the given appointment id
        // details are available in req.body like req.body.id, req.body.date, etc.
        await pool.query(``);

        // update the prescription in the appoints table for the given appointment id
        await pool.query(``);

        req.flash('success', 'Appointment updated successfully');
        return res.redirect('/');

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}