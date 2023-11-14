const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;


// user: process.env.USER,
// host: process.env.HOST,
// database: process.env.DATABASE,
// password: process.env.PASSWORD,
// port: Number(process.env.port)