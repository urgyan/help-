const express = require('express');
const router = express.Router();

router.use('/post',require('./post_api'));
router.use('/user',require('./user'));


module.exports = router;