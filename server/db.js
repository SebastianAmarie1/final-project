const Pool = require("pg").Pool//use Pool to connect to the databse

const pool = new Pool({ // use this to tell the details of what you want to connect to
    user: "postgres",
    password:"Lokenter1",
    host:"localhost",
    port:5432,
    database:"finalproject"
})

module.exports = pool;