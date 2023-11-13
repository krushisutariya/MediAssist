const pool = require('../config/db');

// Rendering the page showing the medicine stocks present at the pharmacy and respective quantities
module.exports.stocks = async (req, res) => {
    try {
        
        // req.user.email has the email of pharmacy logged in from which you can use the stores table to
        // find out the medicines and their quantities present in the pharmacy

        

        let medicines = await pool.query(`SELECT name, brand_name, stock FROM stores WHERE email_pharm = $1`,[req.user.email]);

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

        let medicines = await pool.query(`SELECT name, brand_name, stock FROM stores WHERE email_pharm = $1`,[req.user.email]);

        medicines = medicines.rows;

        let brands = await pool.query(`SELECT distinct(brand_name) FROM stores WHERE email_pharm = $1`, [req.user.email]);
        brands = brands.rows;
        console.log(brands);

        return res.render('pharmacy-update-stocks', {
            title: 'Update Stocks',
            medicines: medicines,
            brands: brands
        });

    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

// Update Stock of a given medicine
module.exports.update_medicine_stocks = async function(req, res){
    if(req.params.email === req.user.email){
        try {
            // write a query wherein you are having all the details in req.body and you need to update the stock
            // of a medicine given its brand_name as req.body.brand and name as req.body.medicine. Also the new stock value is in req.body.stock
            await pool.query(`UPDATE stores SET stocks=$3 WHERE brand_name = $1 AND name = $2`,[req.body.brand,req.body.medicine,req.body.stock]);

            req.flash('success', 'Data Updated Successfully!');
            return res.redirect('/');
        } catch (error){
            console.log('Error: ', err);
            return res.redirect('back');
        }
    } else {
        return res.redirect('back');
    }
}

// Add a new medicine
module.exports.add_medicine = async (req, res) => {
    try {
        
        // write a query to insert a medicine into the medicne table and the stores table with 
        // name in req.body.name, brand_name in req.body.brand_name, stock in req.body.stock and 
        // pharma email in req.user.email
        await pool.query(`INSERT into medicine(name,brand_name) VALUES ($1,$2),INSERT INTO stores (email_pharma,name,brand_name,stock) VALUES ($3,$1,$2,$4)`,[req.body.name,req.body.brand_name,req.body.email,req.body.stock]);

        req.flash('success', 'Medicine added Successfully!');
        return res.redirect('back');

    } catch (error) {
        console.log('Error: ', err);
        return res.status(500).json({ msg: 'Internal Server Error'});
    }
}