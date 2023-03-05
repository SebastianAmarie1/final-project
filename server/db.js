const Pool = require("pg").Pool//use Pool to connect to the databse
require('dotenv').config();

const pool = new Pool({ // use this to tell the details of what you want to connect to
    user: process.env.USER,
    password: process.env.PASSWORD,
    host:process.env.HOST,
    port:process.env.PORT,
    database:process.env.DATABASE
})

module.exports = pool;