const dotenv = require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

const pool  = mysql.createPool({
    connectionLimit : 10,
    queueLimit      : 0,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PW,
    database        : process.env.DB_NAME,
    port            : process.env.DB_PORT,
    waitForConnections: true,
    ssl             : {
      ca : fs.readFileSync(__dirname + process.env.CRT)
    }
  });

module.exports.testConnection = function(numOne, numTwo) {
    const sql = `SELECT ${numOne} + ${numTwo} AS solution`;
    // get connection from pool
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        // make query
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) throw err;
            console.log(results.length);
            console.log('The solution is: ', results[0].solution);
        });
    });
};

module.exports.write = function(table, columns, values) {
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${values});`
    // get connection from pool
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        // make query
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) throw err;
            console.log(results);
        });
    });
};

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log(results.length);
//   console.log('The solution is: ', results[0].solution);
// });