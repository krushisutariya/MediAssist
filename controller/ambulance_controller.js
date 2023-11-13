const pool = require('../config/db');
const axios = require('axios');

module.exports.nearby_hospitals = async function(req, res){
    try {
        let hospitals = await pool.query(`select * from hospital`);
        hospitals = hospitals.rows;
        let nearbyHospitals = [];
        let distanceTime = [];

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
                    const travelTime = route.summary.travelTimeInSeconds / 3600; // in hrs
    
                    if (distance < 30) {
                        await nearbyHospitals.push(hospital);
                        distanceTime[hospital.email] = {
                            distance: distance,
                            travelTime: travelTime
                        };
                    }
                } else {
                    console.error('No route found.');
                }
            }
        }
    
        return res.render('ambulance-nearby-hospitals', {
            title: 'Nearby Hospitals',
            hospitals: nearbyHospitals,
            distanceTime: distanceTime
        });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error!' });
    }
    
}