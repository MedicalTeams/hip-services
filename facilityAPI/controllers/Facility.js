'use strict';
var url = require('url');
var Facility = require('./FacilityService');
var common = require('./Common');
var handleResults = common.handleResults;
var getCountry = common.getCountry;

module.exports.getAllFacilities = function getAllFacilities(req, res, next) {
    var settlement = req.swagger.params['settlement'].value;
	var country = getCountry(req);

    if (typeof settlement !== 'undefined')
		Facility.getFacilitiesBySettlement(country, settlement, function callback(r,e) {handleResults(r, e, res);});
    else
		Facility.getAllFacilities(country, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.getFacilityById = function getFacilityById(req, res, next) {
	var facilityId = req.swagger.params['facilityId'].value;
	var country = getCountry(req);

	var result = Facility.getFacilityById(country, facilityId, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.getVisitsByFacility = function getVisitsByFacility(req, res, next) {
	var facilityId = req.swagger.params['facilityId'].value;
	var country = getCountry(req);

	var result = Facility.getVisitsByFacility(country, facilityId, function callback(r,e) {handleResults(r, e, res);});
};


module.exports.getVisit = function getVisitsByFacility(req, res, next) {
	var visitKey = req.swagger.params['visitKey'].value;
	var country = getCountry(req);
	var result = Facility.getVisit(country, visitKey, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.postVisitAtFacility = function postVisitAtFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
	var body = req.swagger.params['body'].value;
	var country = getCountry(req);
	var result = Facility.postVisitAtFacility(country, facilityId, body, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.postVisitsAtFacility = function postVisitsAtFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
	var body = req.swagger.params['body'].value;
	var country = getCountry(req);
    var result = Facility.postVisitsAtFacility(country, facilityId, body, function callback(r,e) {handleResults(r, e, res);});
};

