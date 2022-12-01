# mvhub
This small application parses incoming sale webhooks from Thrivecart and Teachable and writes data to a MySQL database.

## Setup
1. Replace placeholder environment variables with your own. 
    - Note: You will see there are two Thrivecart tables. This application was setup to write transaction IDs from Thrivecart to a separate MySQL table. This is because multiple products purchased from Thrivecart, even through the same checkout process, receive different transaction IDs when processed through Authorize.net. This was done to meet a unique business case and yours may differ.

    - Thrivecart also sends webhooks with a unique secret that allows you to validate hooks before ingesting them into your database, hence the inclusion of TC_SECRET in the placeholder .env file.

2. Rename ".env_placeholder" to ".env"

3. If desired, you can modify the routes you want Teachable and Thrivecart to send webhooks to under the routes folder within the teachable.js and thrivecart.js files.

4. The teachable.js and thrivecart.js files under the controllers folder are where you'll setup the columns matching your MySQL table structure and pull corresponding values from the webhook request body.

5. After deploying your application, you will go to the webhook setup portal on Thrivecart and Teachable and specify the URLs to which they should send webhooks. These URLs should match what you specify in the routes folder files.