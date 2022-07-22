const database = require('../database');

module.exports.sale = (req, res) => {
    console.log('hit on /teachable/sale');
    res.status(200).send('Success');
};

module.exports.processSaleHook = (req, res) => {
    console.log(`***** Start POST at /teachable/sale *****`);
    console.log(req.body);
    console.log(`***** End POST at /teachable/sale *****`);

    const currentDateTime = new Date().toISOString();
    const newObj = req.body.shift(); // pulls webhook out of array into standalone object
    const { type: event_type, object: { user: { name: username, email, id: userid}, 
        course: { name: coursename }, price } } = newObj;

    // creates array of columns matching mysql table structure
    const columns = ['event_type', 'name', 'email', 'userid', 'course', 'transaction_amount', 'insert_time', 'update_time'];
    
    // pushes a matching number of ? marks for the columns above into a placeholder values array for prepared statement format
    const valuesPlaceholder = Array(columns.length).fill('?');

    // creates array of values from newObj corresponding to columns array above
    const values = [event_type, username, email, userid, coursename, price, currentDateTime, currentDateTime]
    
    // writes columns and values arrays to sales table in mysql db
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