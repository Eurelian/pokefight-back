var express = require('express');
var router = express.Router();
const boardController = require('../controllers/boardController')

router.get('/all', boardController.find_all);

router.post('/save', boardController.create_one)

module.exports = router;
