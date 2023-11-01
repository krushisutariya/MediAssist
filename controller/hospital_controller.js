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