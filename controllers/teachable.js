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
    const { type: event_type, object: { user: { name: username, email, id: userid}, 
        course: { name: coursename }, price } } = req.body;
    const currentDateTime = new Date().toISOString();
    const columns = `event_type, name, email, userid, course, transaction_amount, insert_time, update_time`;
    const values = `'${event_type}', '${username}', '${email}', ${userid}, '${coursename}', ${price}, '${currentDateTime}', '${currentDateTime}'`;
    database.write(process.env.DB_TEACHABLE_SALES, columns, values, function(err, results) {
        if (err) { 
            res.send(500, 'Server Error'); 
            return; 
        }
        res.send(results);
    });
    res.status(200).send('Success');
};

// processes a platform join webhook
module.exports.processJoinHook = (req, res) => {
    const { object: { user: { name: username, email, id: userid}, course: { name: coursename }, 
    price } } = req.body;
    console.log(`***** Start POST at /teachable/join *****`);
    console.log(req.body);
    console.log(`Username: ${username} | email: ${email} | userid: ${userid} | course: ${coursename}`)
    console.log(`***** End POST at /teachable/join *****`);
    res.status(204, 'Success');
};