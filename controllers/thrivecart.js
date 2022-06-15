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
    res.status(200).send('success');
};

module.exports.processSaleHook = (req, res) => {
    // const { event, mode, mode_int, thrivecart_account, thrivecart_secret, base_product, 
    // base_product_name, base_product_label, base_product_owner, order_id, invoice_id, order_date, 
    // order_timestamp, currency, customer_id, customer_identifier, customer: { id: customerid, 
    // client_user_agent, client_meta_fbp, origin, email, contactno, address: { country, state, line1, 
    // city, zip }, ip_address, first_name, last_name, name, checkbox_confirmation }, affiliate, 
    // order: { id: orderid, invoice_id: orderinvoiceid, processor, total, total_str, total_gross,
    // total_gross_str, date, date_iso8601, date_unix, tracking_id, tax, future_charges }, transactions, 
    // subscriptions, purchases, purchase_map, purchase_map_flat, accessible_purchases, 
    // accessible_purchase_map, accessible_purchase_map_flat, fulfillment: { url } } = req.body;
    console.log(`***** Start POST at /thrivecart *****`);
    console.log(req.body);
    console.log(`***** End POST at /thrivecart *****`);
    // pool.query(`select * from mvhub_test where id='4';`, function (error, results, fields) {
    //     if (error) throw error;
    //     console.log(results.length);
    //     console.log(results);
    //   });
    res.status(200).send('success');
};