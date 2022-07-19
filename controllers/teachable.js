const database = require('../database');
const dotenv = require('dotenv').config();

module.exports.test = (req, res) => {
    database.testConnection('seven', 5, function(err, results) {
        if (err) { 
            res.send(500, 'Server Error'); 
            return;
        }
    }); 
    res.status(200).send('success');
};

module.exports.index = (req, res) => {
    console.log(`hit on /teachable`);
    res.status(200).send('Success');
};

module.exports.sale = (req, res) => {
    console.log('hit on /teachable/sale');
    res.status(200).send('Success');
};

module.exports.join = (req, res) => {
    console.log('hit on /teachable/join');
    res.status(200).send('Success');
};

// processes a course sale webhook
module.exports.processSaleHook = (req, res) => {
    console.log(`***** Start POST at /teachable/sale *****`);
    console.log(req.body);
    console.log(`***** End POST at /teachable/sale *****`);
    const newObj = req.body.shift();
    const { type: event_type, object: { user: { name: username, email, id: userid}, 
        course: { name: coursename }, price } } = newObj;
    const decimalPrice = (price / 100).toFixed(2);
    const currentDateTime = new Date().toISOString();
    const columns = ['event_type', 'name', 'email', 'userid', 'course', 'transaction_amount', 'insert_time', 'update_time'];
    
    // fills placeholder array with number of ?s matching length of columns array
    const valuesPlaceholder = Array(columns.length).fill('?');
    const values = [event_type, username, email, userid, coursename, decimalPrice, currentDateTime, currentDateTime]
    
    database.write(process.env.DB_TEACHABLE_SALES, columns, valuesPlaceholder, values, function(err, results) {
        if (err) { 
            console.log(err);
            res.send(500, 'Server Error'); 
            return; 
        }
        console.log(results);
    });
    res.status(200).send('Success');
};