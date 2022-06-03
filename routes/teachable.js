const express = require('express');
const router = express.Router();
const teachable = require('../controllers/teachable');

router.route('/sale')
    .get(teachable.sale)
    .post(teachable.processSaleHook);

router.route('/join')
    .get(teachable.join)
    .post(teachable.processJoinHook);

router.route('/test')
    .get(teachable.test);

module.exports = router;