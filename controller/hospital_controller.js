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
    try {
        // You have the data in req.body and can access it like this: req.body.detail_you_want. Make an INSERT query into the Pharmacy table using this data.
        // Write the query in the backticks below
        await pool.query(`INSERT INTO Pharmacy(email,username,name,contact,email_hospital) VALUES ($1,$2,$3,$4,$5)`,[req.body.email,req.body.username,req.body.name,req.body.contact,req.body.hospital]);
        await pool.query(`INSERT INTO Users(email,username,password,role) VALUES ($1,$2,$3,$4)`,[req.body.email,req.body.username,req.body.password,'Pharmacy']);

        req.flash('success', 'Pharmacy added successfully');
        return res.redirect('/');
    } catch (error) {
        console.log('Error: ', err);
        return res.redirect('back');
    }
    
}

// Register a new Laboratory
module.exports.register_lab = async function(req, res){
    try {
        // You have the data in req.body and can access it like this: req.body.detail_you_want. Make an INSERT query into the Pharmacy table using this data.
        // Write the query in the backticks below
        await pool.query(`INSERT INTO Laboratory(email,username,name,contact,instruments,email_hospital) VALUES ($1,$2,$3,$4,$5,$6)`,[req.body.email,req.body.username,req.body.name,req.body.contact,req.body.instruments,req.body.hospital]);
        await pool.query(`INSERT INTO Users(email,username,password,role) VALUES ($1,$2,$3,$4)`,[req.body.email,req.body.username,req.body.password,'Laboratory']);

        req.flash('success', 'Laboratory added successfully');
        return res.redirect('/');
    } catch (error) {
        console.log('Error: ', err);
        return res.redirect('back');
    }
    
}