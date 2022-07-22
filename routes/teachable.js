const express = require('express');
const router = express.Router();
const teachable = require('../controllers/teachable');

router.route('/sale')
    .get(teachable.sale)
    .post(teachable.processSaleHook);

module.exports = router;