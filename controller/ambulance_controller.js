const pool = require('../config/db');
const axios = require('axios');
const Bottleneck = require('bottleneck');

// Create a limiter with a specified rate limit (requests per second)
const limiter = new Bottleneck({
    maxConcurrent: 5, 
    minTime: 1000,    // Minimum time to wait between each request in milliseconds
});

module.exports.nearby_hospitals = async function (req, res) {
    try {
      let hospitals = await pool.query(`SELECT 
                                          name, 
                                          email, 
                                          location,
                                          (icu + iicu + operation_theatre + general_ward) AS total_beds,
                                          (nurse + intern + ot_technician) AS total_staff
                                      FROM 
                                          hospital
                                      ORDER BY 
                                          name;`);
      hospitals = hospitals.rows;
      let nearbyHospitals = [];
      let distanceTime = [];
  
      if (req.query) {
        const lat = req.query.lat;
        const lng = req.query.lng;
  
        // find the nearby hospitals
        for (const hospital of hospitals) {
          await limiter.schedule(async () => {
            const apiKey = process.env.apiKey;
  
            const startCoordinates = lat + ',' + lng;
            const endCoordinates = hospital.location.replace(/\s+/g, ''); // Remove spaces
            const traffic = true;
  
            const tomtomApiEndpoint = 'https://api.tomtom.com/routing/1/calculateRoute/';
            const url = `${tomtomApiEndpoint}${startCoordinates}:${endCoordinates}/json?key=${apiKey}&traffic=${traffic}`;
  
            try {
              const response = await axios.get(url);
              const data = response.data;
              const route = data.routes && data.routes[0];
  
              if (route) {
                const distance = route.summary.lengthInMeters / 1000; // in km
                const travelTime = route.summary.travelTimeInSeconds / 3600; // in hrs
  
                if (distance < 20) {
                  nearbyHospitals.push(hospital);
                  distanceTime[hospital.email] = {
                    distance: distance,
                    travelTime: travelTime
                  };
                }
              } else {
                console.error('No route found.');
              }
            } catch (error) {
              console.error('Error fetching TomTom data:', error.message);
            }
          });
        }
      }
  
      return res.render('ambulance-nearby-hospitals', {
        title: 'Nearby Hospitals',
        hospitals: nearbyHospitals,
        distanceTime: distanceTime
      });
    } catch (error) {
      console.error('Error: ', error);
      return res.status(500).json({ error: 'Server Error!' });
    }
  };