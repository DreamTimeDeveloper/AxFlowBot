// routes/webhook.js
const { Router } = require('express');
const { verify, receive } = require('../controllers/webhook.controller.js');

const router = Router();
router.get('/', verify);
router.post('/', receive);

module.exports = router;
