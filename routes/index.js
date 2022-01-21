const express = require('express');
const router = express.Router();
const home = require("../controllers/home_controller");
console.log("Router is loaded");


router.get('/',home.home);

//For accessing other router we use middlewears
// router.use('/about',require('./about'));
router.use('/user',require('./users'));
router.use('/post',require('./post'));
router.use('/comment',require('./comment'));
router.use('/api',require('./api'));
router.use('/likes',require('./likes'));
router.use('/friend',require('./friends'));

module.exports = router;