const express = require('express');
const router = express.Router();
const friendController = require('../controllers/add_friend_controller');

router.post('/add-friend',friendController.addFriend);

module.exports = router;