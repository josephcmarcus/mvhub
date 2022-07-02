const database = require('../database');

module.exports.test = (req, res) => {
    database.testConnection(2, 2, function(err, results) {
        if (err) { 
            res.send(500, 'Server Error'); 
            return;
        }
        res.send(results);
    });
};

module.exports.index = (req, res) => {
    console.log(`***** Start GET at /thrivecart *****`);
    console.log(req.body);
    console.log(`***** End GET at /thrivecart *****`);
    res.status(200).send('Success');
};

module.exports.sale = (req, res) => {
    console.log('hit on /thrivecart/sale');
    res.status(200).send('Success');
};

module.exports.processSaleHook = (req, res) => {
    const { event, thrivecart_secret } = req.body;
    console.log(`***** Start POST at /thrivecart/sale *****`);
    console.log(req.body);
    console.log(`***** End POST at /thrivecart/sale *****`);
    const currentDateTime = new Date().toISOString();
    if (thrivecart_secret != process.env.TC_SECRET) {
        console.log('Unauthorized')
        res.status(401).send('Unauthorized');
    } else if (event != 'order.success') {
        console.log('Unauthorized - Not a Sale')
        res.status(401).send('Unauthorized - Not a Sale');
    } else {
        const { thrivecart_account, order_id, invoice_id, order_date, order_timestamp, currency, 
            customer_id, customer: { email, address: { country, state, line1: street, city, zip }, 
            ip_address, first_name, last_name, checkbox_confirmation }, order: { processor, charges }} = req.body;
        console.log('Authorized - Sale')
        for (let i = 0; i < charges.length; i++) {
            const columns = ['event', 'thrivecart_account', 'thrivecart_secret', 'order_id', 'invoice_id', 'order_date', 
            'order_timestamp', 'currency', 'customer_id', 'first_name', 'last_name', 'email', 'country', 'state', 'street', 
            'city', 'zip', 'ip_address', 'checkbox_confirmation', 'processor', 'product_name', 'product_reference', 'amount', 
            'amount_str', 'quantity', 'insert_time', 'update_time'];
            let valuesPrep = [];
            for (colName of columns) {
                valuesPrep.push('?')
            };
            const values = [event, thrivecart_account, thrivecart_secret, order_id, invoice_id, order_date, order_timestamp, 
                currency, customer_id, first_name, last_name, email, country, state, street, city, zip, ip_address, 
                checkbox_confirmation, processor, charges[i].name, charges[i].reference, charges[i].amount, charges[i].amount_str, 
                charges[i].quantity, currentDateTime, currentDateTime];
            database.write(process.env.DB_THRIVECART_SALES, columns, valuesPrep, values, function(err, results) {
                if (err) { 
                    console.log(err);
                    res.send(500, 'Server Error'); 
                    return; 
                }
                res.send(results);
            });
    }
    res.status(200).send('Success');
    }
};