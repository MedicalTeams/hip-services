'use strict';
var url = require('url');
var Visit = require('./VisitService');
var common = require('./Common');
var handleResults = common.handleResults;
var getCountry = common.getCountry;

module.exports.postVisit = function postVisit(req, res, next) {
	var body = req.swagger.params['body'].value;
	var country = getCountry(req);
    var result = Visit.postVisit(country, body, function callback(r, e) {handleResults(r, e, res);});
};

module.exports.postVisits = function postVisits(req, res, next) {
	var body = req.swagger.params['body'].value;
	var country = getCountry(req);
    var result = Visit.postVisits(country, body, function callback(r, e) {handleResults(r, e, res);});
};

