const pool = require('../config/db');
const axios = require('axios');

// Render the appointment booking page
module.exports.find_hospitals_doctors = async (req, res) => {
    
    try {
        let hospitals = await pool.query(`select * from hospital`);
        hospitals = hospitals.rows;
        let nearbyHospitals = [];
        let doctorsInNearbyHospitals = [];
    
        if (Object.keys(req.query).length > 0) {
            const lat = req.query.lat;
            const lng = req.query.lng;
    
            // find the nearby hospitals
            for (const hospital of hospitals) {
                const apiKey = process.env.apiKey;
    
                const startCoordinates = lat + ',' + lng;
                const endCoordinates = hospital.location.replace(/\s+/g, ''); // Remove spaces
                const traffic = true;
    
                const tomtomApiEndpoint = 'https://api.tomtom.com/routing/1/calculateRoute/';
                const url = `${tomtomApiEndpoint}${startCoordinates}:${endCoordinates}/json?key=${apiKey}&traffic=${traffic}`;
    
                const response = await axios.get(url);
                const data = response.data;
                const route = data.routes && data.routes[0];
    
                if (route) {
                    const distance = route.summary.lengthInMeters / 1000; // in km
                    const travelTime = route.summary.travelTimeInSeconds / 3600; // in hrs
    
                    if (distance < 20) {
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
        } else {

            let location = await pool.query(`select location from patient where email=$1`, [req.user.email]);
            location = location.rows[0].location;


            // find the nearby hospitals
            for (const hospital of hospitals) {
                const apiKey = process.env.apiKey;
    
                const startCoordinates = location;
                const endCoordinates = hospital.location.replace(/\s+/g, ''); // Remove spaces
                const traffic = true;
    
                const tomtomApiEndpoint = 'https://api.tomtom.com/routing/1/calculateRoute/';
                const url = `${tomtomApiEndpoint}${startCoordinates}:${endCoordinates}/json?key=${apiKey}&traffic=${traffic}`;
    
                const response = await axios.get(url);
                const data = response.data;
                const route = data.routes && data.routes[0];
    
                if (route) {
                    const distance = route.summary.lengthInMeters / 1000; // in km
                    const travelTime = route.summary.travelTimeInSeconds / 3600; // in hrs
    
                    if (distance < 20) {
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

// Render the appointments page
module.exports.check_slots = function (req, res) {
    return res.render('appointment', {
        title: "Appointment | MediAssist",
        date: null,
        available: false,
        doctor: req.params.email
    });
}

// Check if the doctor is available on the given date
module.exports.check_availability = async function (req, res) {
    try {
        let date = req.body.date;
        let slots = await pool.query(`select * from appoints where date=$1 AND doc_email=$2`, [date, req.params.email]);
        slots = slots.rows;

        if (slots.length == 0) {
            
            let startTime = await pool.query(`select start_time from works where doc_email=$1`, [req.params.email]);
            startTime = startTime.rows[0].start_time;
            let endTime = await pool.query(`select end_time from works where doc_email=$1`, [req.params.email]);
            endTime = endTime.rows[0].end_time;
            const newSlots = [];

            const slotDuration = 60 * 60 * 1000; // 1 hour in milliseconds

            let formattedStartTime = "";
            let formattedEndTime = "";
            
            if(!startTime || !endTime) {
                start_time = new Date(date + 'T09:00:00');
                end_time = new Date(date + 'T17:00:00');
                const numberOfSlots = 8;

                for (let i = 0; i < numberOfSlots; i++) {
                    const slotStartTime = new Date(startTime.getTime() + i * slotDuration);
                    const slotEndTime = new Date(slotStartTime.getTime() + slotDuration);

                    // Extract hours and minutes from Date object using getHours() and getMinutes() methods
                    const start_hours = slotStartTime.getHours();
                    const start_minutes = slotStartTime.getMinutes();
                    formattedStartTime = `${start_hours.toString().padStart(2, '0')}:${start_minutes.toString().padStart(2, '0')}`;

                    const end_hours = slotEndTime.getHours();
                    const end_minutes = slotEndTime.getMinutes();
                    formattedEndTime = `${end_hours.toString().padStart(2, '0')}:${end_minutes.toString().padStart(2, '0')}`;

                    newSlots.push({
                        start_time: formattedStartTime,
                        end_time: formattedEndTime,
                        is_booked: false
                    });
                }
            } else {
                const numberOfSlots = parseInt(endTime.substring(0, 2), 10) - parseInt(startTime.substring(0, 2), 10);
                
                const start_time = new Date(date + 'T' + startTime + ':00');
                const end_time = new Date(date + 'T' + endTime + ':00');
                
                for(let i = 0; i < numberOfSlots; i++){
                    const slotStartTime = new Date(start_time.getTime() + i * slotDuration);
                    const slotEndTime = new Date(slotStartTime.getTime() + slotDuration);

                    // Extract hours and minutes from Date object using getHours() and getMinutes() methods
                    const start_hours = slotStartTime.getHours();
                    const start_minutes = slotStartTime.getMinutes();
                    formattedStartTime = `${start_hours.toString().padStart(2, '0')}:${start_minutes.toString().padStart(2, '0')}`;

                    const end_hours = slotEndTime.getHours();
                    const end_minutes = slotEndTime.getMinutes();
                    formattedEndTime = `${end_hours.toString().padStart(2, '0')}:${end_minutes.toString().padStart(2, '0')}`;

                    newSlots.push({
                        start_time: formattedStartTime,
                        end_time: formattedEndTime,
                        is_booked: false
                    });
                }
            }

            return res.render('appointment', {
                title: 'Appointment | MediAssist',
                slots: newSlots,
                date: date,
                available: true,
                doctor: req.params.email
            });

        } else {

            let startTime = await pool.query(`select start_time from works where doc_email=$1`, [req.params.email]);
            startTime = startTime.rows[0].start_time;
            let endTime = await pool.query(`select end_time from works where doc_email=$1`, [req.params.email]);
            endTime = endTime.rows[0].end_time;
            const newSlots = [];

            const slotDuration = 60 * 60 * 1000; // 1 hour in milliseconds

            let formattedStartTime = "";
            let formattedEndTime = "";
            
            if(!startTime || !endTime) {
                start_time = new Date(date + 'T09:00:00');
                end_time = new Date(date + 'T17:00:00');
                const numberOfSlots = 8;

                for (let i = 0; i < numberOfSlots; i++) {
                    const slotStartTime = new Date(startTime.getTime() + i * slotDuration);
                    const slotEndTime = new Date(slotStartTime.getTime() + slotDuration);

                    // Extract hours and minutes from Date object using getHours() and getMinutes() methods
                    const start_hours = slotStartTime.getHours();
                    const start_minutes = slotStartTime.getMinutes();
                    formattedStartTime = `${start_hours.toString().padStart(2, '0')}:${start_minutes.toString().padStart(2, '0')}`;

                    const end_hours = slotEndTime.getHours();
                    const end_minutes = slotEndTime.getMinutes();
                    formattedEndTime = `${end_hours.toString().padStart(2, '0')}:${end_minutes.toString().padStart(2, '0')}`;

                    if(slots.some(slot =>
                        slot.start_time === formattedStartTime && slot.end_time === formattedEndTime
                    )) {
                        newSlots.push({
                            start_time: formattedStartTime,
                            end_time: formattedEndTime,
                            is_booked: true
                        });
                    } else {
                        newSlots.push({
                            start_time: formattedStartTime,
                            end_time: formattedEndTime,
                            is_booked: false
                        });
                    }
                }
            } else {
                const numberOfSlots = parseInt(endTime.substring(0, 2), 10) - parseInt(startTime.substring(0, 2), 10);
                
                const start_time = new Date(date + 'T' + startTime + ':00');
                const end_time = new Date(date + 'T' + endTime + ':00');
                
                for(let i = 0; i < numberOfSlots; i++){
                    const slotStartTime = new Date(start_time.getTime() + i * slotDuration);
                    const slotEndTime = new Date(slotStartTime.getTime() + slotDuration);

                    // Extract hours and minutes from Date object using getHours() and getMinutes() methods
                    const start_hours = slotStartTime.getHours();
                    const start_minutes = slotStartTime.getMinutes();
                    formattedStartTime = `${start_hours.toString().padStart(2, '0')}:${start_minutes.toString().padStart(2, '0')}`;

                    const end_hours = slotEndTime.getHours();
                    const end_minutes = slotEndTime.getMinutes();
                    formattedEndTime = `${end_hours.toString().padStart(2, '0')}:${end_minutes.toString().padStart(2, '0')}`;

                    if(slots.some(slot =>
                        slot.start_time === formattedStartTime && slot.end_time === formattedEndTime
                    )) {
                        newSlots.push({
                            start_time: formattedStartTime,
                            end_time: formattedEndTime,
                            is_booked: true
                        });
                    } else {
                        newSlots.push({
                            start_time: formattedStartTime,
                            end_time: formattedEndTime,
                            is_booked: false
                        });
                    }
                }
            }

            return res.render('appointment', {
                title: 'Appointment | MediAssist',
                slots: newSlots,
                date: date,
                available: true,
                doctor: req.params.email
            });
        }

    } catch (err) {
        console.log('Error: ', err);
        return res.redirect('back');
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

        const [start_time, end_time] = req.body.slot.split(',');

        // Update the appoints table by making the is_pending bit 1 and adding the patient's email and id
        // req.user.email is the patient's email and req.params.email is the doctor's email
        await pool.query(`INSERT INTO appoints(is_pending, patient_email, id, doc_email, date, start_time, end_time) VALUES  ('1', $1, $2, $3, $4, $5, $6)`, [req.user.email, id, req.query.email, req.query.date, start_time, end_time]);
        let slot = await pool.query(`select * from appoints where id=$1`, [id]);
        slot = slot.rows[0];
        let name = await pool.query(`select name from patient where email=$1`, [req.user.email]);
        name = name.rows[0].name;

        req.flash('success', 'Appointment booked successfully');
        return res.render('appointment_display', {
            title: 'Appointment Booked | MediAssist',
            slot: slot,
            name: name,
            email: req.user.email
        });
        
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
        let upcoming_appointments = await pool.query(`select * from appoints where patient_email=$1 AND is_pending ='1'`,[req.user.email]);
        upcoming_appointments = upcoming_appointments.rows;

        let past_appointments = await pool.query(`select * from appoints where patient_email=$1 AND is_pending ='0'`,[req.user.email]);
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

// Cancel an appointment
module.exports.cancel_appointment = async (req, res) => {
    try {
        const { id } = req.params;
        // Given the appointment id, delete the appointment from the appoints table
        await pool.query(`delete from appoints where id= $1`, [id]);

        req.flash('success', 'Appointment cancelled successfully');
        return res.redirect('back');
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error' });
    }
}