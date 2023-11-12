const pool = require('../config/db');
const axios = require('axios');

// Render the appointment booking page
module.exports.find_hospitals_doctors = async (req, res) => {
    
    try {
        let hospitals = await pool.query(`select * from hospital`);
        hospitals = hospitals.rows;
        let nearbyHospitals = [];
        let doctorsInNearbyHospitals = [];
    
        if (req.query) {
            const lat = req.query.lat;
            const lng = req.query.lng;
    
            // find the nearby hospitals
            for (const hospital of hospitals) {
                const apiKey = process.env.apiKey;
    
                const startCoordinates = lat + ',' + lng;
                const endCoordinates = hospital.location;
                const traffic = true;
    
                const tomtomApiEndpoint = 'https://api.tomtom.com/routing/1/calculateRoute/';
                const url = `${tomtomApiEndpoint}${startCoordinates}:${endCoordinates}/json?key=${apiKey}&traffic=${traffic}`;
    
                const response = await axios.get(url);
                const data = response.data;
                const route = data.routes && data.routes[0];
    
                if (route) {
                    const distance = route.summary.lengthInMeters / 1000; // in km
                    console.log(typeof (distance));
                    console.log(distance);
                    const travelTime = route.summary.travelTimeInSeconds / 3600; // in hrs
    
                    if (distance < 30) {
                        await nearbyHospitals.push(hospital);
    
                        let doctors = await pool.query(`select * from doctor where email in (
                                select doc_email from works where hosp_email=$1
                            )`, [hospital.email]);
                        doctors = doctors.rows;
    
                        doctorsInNearbyHospitals[hospital.email] = {
                            doctors: doctors,
                            distance: distance,
                            travelTime: travelTime
                        };
                    }
                } else {
                    console.error('No route found.');
                }
            }
        }
    
        console.log(nearbyHospitals);
        console.log(doctorsInNearbyHospitals);
        return res.render('patient-find-hospitals-doctors', {
            title: 'Find Hospitals and Doctors',
            hospitals: nearbyHospitals,
            doctorsInNearbyHospitals: doctorsInNearbyHospitals
        });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error!' });
    }
    

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