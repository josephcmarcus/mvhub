const database = require('../database');
const { mailchimp } = require('../utils/microservicehandler');

module.exports.sale = (req, res) => {
    console.log('hit on /thrivecart/sale');
    res.status(200).send('Success');
};

module.exports.processSaleHook = (req, res) => {
    console.log(`***** Start POST at /thrivecart/sale *****`);
    console.log(req.body);
    console.log(`***** End POST at /thrivecart/sale *****`);
    
    const currentDateTime = new Date().toISOString();
    if (req.body.thrivecart_secret != process.env.TC_SECRET) { // checks if webhook includes Thrivecart account secret
        res.status(401).send('Unauthorized');
    } else if (req.body.event != 'order.success') { // checks and validates the event type of the webhook
        res.status(401).send('Unauthorized - Not a Sale');
    } else {
        const { thrivecart_account, thrivecart_secret, event, order_id, invoice_id, order_date, order_timestamp, 
            currency, customer_id, customer: { email, address: { country, state, line1: street, city, zip },
            ip_address, first_name, last_name, checkbox_confirmation }, order: { processor, charges },
            transactions } = req.body;
        const source = 'school';

        // loop used to write each charge to separate row in mysql db
        for (let i = 0; i < charges.length; i++) {
            const total = parseFloat(charges[i].tax_paid_str) + parseFloat(charges[i].amount_str);

            // creates array of columns matching mysql table structure
            const columnsSales = ['thrivecart_account', 'thrivecart_secret', 'source', 'order_id',
                'invoice_id', 'order_date', 'order_timestamp', 'currency', 'customer_id', 'first_name',
                'last_name', 'email', 'country', 'state', 'street', 'city', 'zip', 'ip_address',
                'checkbox_confirmation', 'processor', 'product_name', 'product_reference', 'amount',
                'amount_str', 'sales_tax', 'total', 'net', 'quantity', 'event', 'insert_time', 'update_time'];

            /* pushes a matching number of ? marks for the columns above into a placeholder values array for 
            prepared statement format */
            const valuesPlaceholderSales = Array(columnsSales.length).fill('?');

            // creates array of values from req.body corresponding to columns array above
            const valuesSales = [thrivecart_account, thrivecart_secret, source, order_id, invoice_id,
                order_date, order_timestamp, currency, customer_id, first_name, last_name, email, country,
                state, street, city, zip, ip_address, checkbox_confirmation, processor, charges[i].name,
                charges[i].reference, charges[i].amount, charges[i].amount_str, charges[i].tax_paid_str,
                total, charges[i].amount_str, charges[i].quantity, event, currentDateTime, currentDateTime];

            const transactionsArray = Object.values(transactions);
            const columnsTransactionId = ['email', 'ip_address', 'net', 'product_name', 'transaction_id', 'insert_time',
                'update_time']

            const valuesPlaceholderTransactionId = Array(columnsTransactionId.length).fill('?');
            const valuesTransactionId = [email, ip_address, charges[i].amount_str, charges[i].name, transactionsArray[i],
                currentDateTime, currentDateTime];

            // writes columnsSales and valuesSales arrays to sales table in mysql db
            database.write(process.env.DB_THRIVECART_SALES, columnsSales, valuesPlaceholderSales, valuesSales,
                function(err, results) {
                    if (err) {
                        console.log(err);
                        res.send(500, 'Server Error');
                        return;
                    }
                    console.log(results);
                });
            
            // writes columnsTransactionId and valuesTransactionId arrays to transaction id table in mysql db
            database.write(process.env.DB_THRIVECART_TRANSACTION_ID, columnsTransactionId,
                valuesPlaceholderTransactionId, valuesTransactionId, function(err, results) {
                    if (err) {
                        console.log(err);
                        res.send(500, 'Server Error');
                        return;
                    }
                    console.log(results);
                });
            
            // passes product name and email to the Mailchimp add tag handler
            mailchimp.addTag(charges[i].name, email);
        };

        res.status(200).send('Success');
    };
};