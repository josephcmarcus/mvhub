const express = require('express');
const router = express.Router();
const thrivecart = require('../controllers/thrivecart');

router.route('/sale')
    .get(thrivecart.sale)
    .post(thrivecart.processSaleHook);

module.exports = router;