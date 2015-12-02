'use strict';
var url = require('url');
var Visit = require('./VisitService');
var common = require('./Common');
var handleResults = common.handleResults;

module.exports.postVisit = function postVisit(req, res, next) {
    var body = req.swagger.params['body'].value;
    var result = Visit.postVisit(body, function callback(r, e) {handleResults(r, e, res);});
};

module.exports.postVisits = function postVisits(req, res, next) {
    var body = req.swagger.params['body'].value;
    var result = Visit.postVisits(body, function callback(r, e) {handleResults(r, e, res);});
};

