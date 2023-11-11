const pool = require('../config/db');

// Rendering the page for displaying doctor's name, email, specialization, contact and reg_no
module.exports.doctors = async (req, res) => {
    try {
        let doctors = await pool.query(``);
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
        let hospitals = await pool.query(``);
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

// let hospitals = [
    // {
    //     "name": "City General Hospital",
    //     "email": "info@citygeneralhospital.com",
    //     "specialization": "General Medicine",
    //     "total_beds": 300,
    //     "total_staff": 150
    //   },
    //   {
    //     "name": "Sunset Community Hospital",
    //     "email": "info@sunsetcommunityhospital.com",
    //     "specialization": "Emergency Medicine",
    //     "total_beds": 200,
    //     "total_staff": 100
    //   },
    //   {
    //     "name": "Greenview Regional Medical Center",
    //     "email": "info@greenviewmedicalcenter.com",
    //     "specialization": "Surgery",
    //     "total_beds": 250,
    //     "total_staff": 120
    //   },
    //   {
    //     "name": "Lakefront Health Center",
    //     "email": "info@lakefronthealthcenter.com",
    //     "specialization": "Obstetrics and Gynecology",
    //     "total_beds": 180,
    //     "total_staff": 90
    //   },
    //   {
    //     "name": "Mountain View Hospital",
    //     "email": "info@mountainviewhospital.com",
    //     "specialization": "Orthopedics",
    //     "total_beds": 220,
    //     "total_staff": 110
    //   },
    //   {
    //     "name": "Pinecrest Medical Center",
    //     "email": "info@pinecrestmedicalcenter.com",
    //     "specialization": "Cardiology",
    //     "total_beds": 280,
    //     "total_staff": 140
    //   },
    //   {
    //     "name": "Harborview Medical Center",
    //     "email": "info@harborviewmedicalcenter.com",
    //     "specialization": "Neurology",
    //     "total_beds": 320,
    //     "total_staff": 160
    //   },
    //   {
    //     "name": "Riverside Community Hospital",
    //     "email": "info@riversidemedicalcenter.com",
    //     "specialization": "Pediatrics",
    //     "total_beds": 190,
    //     "total_staff": 95
    //   },
    //   {
    //     "name": "Valley Regional Hospital",
    //     "email": "info@valleyregionalhospital.com",
    //     "specialization": "Psychiatry",
    //     "total_beds": 240,
    //     "total_staff": 120
    //   },
    //   {
    //     "name": "Oceanfront Health Institute",
    //     "email": "info@oceanfronthealthinstitute.com",
    //     "specialization": "Oncology",
    //     "total_beds": 200,
    //     "total_staff": 100
    //   }
    // ];

    // let doctors = [
        //     {
        //       "reg_no": "DR001",
        //       "name": "Dr. John Smith",
        //       "email": "john.smith@example.com",
        //       "specialization": "Cardiology",
        //       "contact": "123-456-7890"
        //     },
        //     {
        //       "reg_no": "DR002",
        //       "name": "Dr. Jane Doe",
        //       "email": "jane.doe@example.com",
        //       "specialization": "Pediatrics",
        //       "contact": "234-567-8901"
        //     },
        //     {
        //       "reg_no": "DR003",
        //       "name": "Dr. Michael Johnson",
        //       "email": "michael.johnson@example.com",
        //       "specialization": "Orthopedics",
        //       "contact": "345-678-9012"
        //     },
        //     {
        //       "reg_no": "DR004",
        //       "name": "Dr. Emily Davis",
        //       "email": "emily.davis@example.com",
        //       "specialization": "Dermatology",
        //       "contact": "456-789-0123"
        //     },
        //     {
        //       "reg_no": "DR005",
        //       "name": "Dr. Robert Wilson",
        //       "email": "robert.wilson@example.com",
        //       "specialization": "Neurology",
        //       "contact": "567-890-1234"
        //     },
        //     {
        //       "reg_no": "DR006",
        //       "name": "Dr. Sarah Brown",
        //       "email": "sarah.brown@example.com",
        //       "specialization": "Ophthalmology",
        //       "contact": "678-901-2345"
        //     },
        //     {
        //       "reg_no": "DR007",
        //       "name": "Dr. Christopher Miller",
        //       "email": "christopher.miller@example.com",
        //       "specialization": "Gastroenterology",
        //       "contact": "789-012-3456"
        //     },
        //     {
        //       "reg_no": "DR008",
        //       "name": "Dr. Olivia White",
        //       "email": "olivia.white@example.com",
        //       "specialization": "ENT",
        //       "contact": "890-123-4567"
        //     },
        //     {
        //       "reg_no": "DR009",
        //       "name": "Dr. William Taylor",
        //       "email": "william.taylor@example.com",
        //       "specialization": "Internal Medicine",
        //       "contact": "901-234-5678"
        //     },
        //     {
        //       "reg_no": "DR010",
        //       "name": "Dr. Amanda Turner",
        //       "email": "amanda.turner@example.com",
        //       "specialization": "Psychiatry",
        //       "contact": "012-345-6789"
        //     }
        //   ];