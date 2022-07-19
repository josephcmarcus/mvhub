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
        console.log('Authorized - Sale')
        const { thrivecart_account, order_id, invoice_id, order_date, order_timestamp, currency, 
            customer_id, customer: { email, address: { country, state, line1: street, city, zip }, 
            ip_address, first_name, last_name, checkbox_confirmation }, order: { processor, charges }, transactions} = req.body;
        const source = 'school';

        for (let i = 0; i < charges.length; i++) {
            const columnsSales = ['thrivecart_account', 'thrivecart_secret', 'source', 'order_id', 'invoice_id', 'order_date', 
            'order_timestamp', 'currency', 'customer_id', 'first_name', 'last_name', 'email', 'country', 'state', 'street', 
            'city', 'zip', 'ip_address', 'checkbox_confirmation', 'processor', 'product_name', 'product_reference', 'amount', 
            'amount_str', 'sales_tax', 'total', 'net', 'quantity', 'event', 'insert_time', 'update_time'];
            let total = parseFloat(charges[i].tax_paid_str) + parseFloat(charges[i].amount_str);

            const valuesPlaceholderSales = Array(columnsSales.length).fill('?') ; // fills placeholder array with number of ?s matching length of columns array
            const valuesSales = [thrivecart_account, thrivecart_secret, source, order_id, invoice_id, order_date, order_timestamp, 
                currency, customer_id, first_name, last_name, email, country, state, street, city, zip, ip_address, 
                checkbox_confirmation, processor, charges[i].name, charges[i].reference, charges[i].amount, charges[i].amount_str, 
                charges[i].tax_paid_str, total, charges[i].amount_str, charges[i].quantity, event, currentDateTime, currentDateTime];
            
            let transactionsArray = Object.values(transactions);
            const columnsTransactionId = ['email', 'ip_address', 'net', 'transaction_id', 'insert_time', 'update_time']
            const valuesPlaceholderTransactionId = Array(columnsTransactionId.length).fill('?');
            const valuesTransactionId = [email, ip_address, charges[i].amount_str, transactionsArray[i], currentDateTime, currentDateTime];

            database.write(process.env.DB_THRIVECART_SALES, columnsSales, valuesPlaceholderSales, valuesSales, function(err, results) {
                if (err) { 
                    console.log(err);
                    res.send(500, 'Server Error'); 
                    return; 
                }
                console.log(results);
            });

            database.write(process.env.DB_THRIVECART_TRANSACTION_ID, columnsTransactionId, valuesPlaceholderTransactionId, 
                valuesTransactionId, function(err, results) {
                if (err) { 
                    console.log(err);
                    res.send(500, 'Server Error'); 
                    return; 
                }
                console.log(results);
            });
    };
    res.status(200).send('Success');
    }
};