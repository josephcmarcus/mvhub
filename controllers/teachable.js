const { mailchimp } = require('../utils/microservicehandler');

module.exports.sale = (req, res) => {
    console.log('hit on /teachable/sale');
    res.status(200).send('Success');
};

module.exports.processSaleHook = (req, res) => {
    console.log(`***** Start POST at /teachable/sale *****`);
    console.log(req.body);
    console.log(`***** End POST at /teachable/sale *****`);

    const newObj = req.body.shift(); // pulls webhook out of array into standalone object
    const { type: event_type, object: { user: { name: email}, course: { name: coursename }}} = newObj;

        if (event_type != 'Sale.created') {
            res.status(401).send('Unauthorized - Not a Sale');
        };

        // passes course name and email to the Mailchimp add tag handler
        mailchimp.addTag(coursename, email);

    res.status(200).send('Success');
};