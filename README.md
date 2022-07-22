# mvhub
This small application parses incoming sale webhooks from Thrivecart and Teachable and writes data to a MySQL database.

## Setup
1. Replace placeholder environment variables with your own. 
    - Note: You will see there are two Thrivecart tables. This application was setup to write transaction IDs from Thrivecart to a separate MySQL table. This is because multiple products purchased from Thrivecart, even through the same checkout process, receive different transaction IDs when processed through Authorize.net. This was done to meet a unique business case and yours may differ.

    - Thrivecart also sends webhooks with a unique secret that allows you to validate hooks before ingesting them into your database, hence the inclusion of TC_SECRET in the placeholder .env file.

2. If desired, you can modify the routes you want Teachable and Thrivecart to send webhooks to under the routes folder within the teachable.js and thrivecart.js files.

3. The teachable.js and thrivecart.js files under the controllers folder are where you'll setup the columns matching your MySQL table structure and pull corresponding values from the webhook request body.
    - The SQL syntax leverages the prepared statement feature for efficiency and security purposes.

    - Since Thrivecart sends several different types of webhooks (sale, abandoned cart, etc...) and this application is only concerned with writing sale data, a check is run against the request body to make sure the event is 'order.success'. If it is not 'order.success', the request is refused. 
        - This is not necessary for Teachable since you can toggle which specific webhook types you want sent to your application from their platform.

4. After deploying your application, you will go to the webhook setup portal on Thrivecart and Teachable and specify the URLs to which they should send webhooks. These URLs should match what you specify in the routes folder files.