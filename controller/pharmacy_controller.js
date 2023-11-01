const pool = require('../config/db');

// Rendering the page showing the medicine stocks present at the pharmacy and respective quantities
module.exports.stocks = async (req, res) => {
    try {
        
        // req.user.email has the email of pharmacy logged in from which you can use the stores table to
        // find out the medicines and their quantities present in the pharmacy
        let medicines = await pool.query(``);
        medicines = medicines.rows;

        return res.render('pharmacy_stocks', {
            title: 'Stocks',
            medicines: medicines
        });

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

// Rendering the page for pharmacy to update the stocks details
module.exports.update_stocks = async (req, res) => {
    try {
        
        // req.user.email has the email of pharmacy logged in from which you can use the stores table to
        // find out those medicines from the pharmacy whose quantity is greater than 0
        let medicines = await pool.query(``);
        medicines = medicines.rows;

        return res.render('pharmacy_update_stocks', {
            title: 'Update Stocks',
            medicines: medicines
        });

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}