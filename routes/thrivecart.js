const express = require('express');
const router = express.Router();
const thrivecart = require('../controllers/thrivecart');

router.route('/sale')
    .get(thrivecart.sale)
    .post(thrivecart.processSaleHook);

router.route('/test')
    .get(thrivecart.test);

module.exports = router;