var express = require('express');
var router = express.Router();

/*
 * GET list of clinic resources
 */
 router.get('/', function(req, res) {
    res.json('["clinic1","clinic2","clinic3"]');
    });

module.exports = router;
    

