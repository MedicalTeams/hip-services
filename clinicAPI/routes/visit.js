var express = require('express');
var router;

function GRAPH(router) {
    this.router = router;
}

/*
 * GET list of visits for the current clinic context
 */
router.get('/', function(req, res) {
    var cid = req.params.clinicId;
    res.json( '["visit1","visit2","visit3"]');
});

/*
 * GET a clinic resources by clinic ID
 */
router.get('/:visitId', function(req, res) {
    var clinicId = req.params.clinicId;
    var visitId = req.params.clinicId;
    res.json({ visitId: 'This is a visit details object'});
});

module.exports = GRAPH;