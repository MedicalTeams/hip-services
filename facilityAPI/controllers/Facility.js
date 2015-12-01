'use strict';
var url = require('url');
var Facility = require('./FacilityService');
var common = require('./Common');
var handleResults = common.handleResults;

module.exports.getAllFacilities = function getAllFacilities(req, res, next) {
    var settlement = req.swagger.params['settlement'].value;

    if (typeof settlement !== 'undefined')
        Facility.getFacilitiesBySettlement(settlement, function callback(r,e) {handleResults(r, e, res);});
    else
        Facility.getAllFacilities(function callback(r,e) {handleResults(r, e, res);});
};

module.exports.getFacilityById = function getFacilityById(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var result = Facility.getFacilityById(facilityId, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.getVisitsByFacility = function getVisitsByFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var result = Facility.getVisitsByFacility(facilityId, function callback(r,e) {handleResults(r, e, res);});
};


module.exports.getVisit = function getVisitsByFacility(req, res, next) {
    var visitKey = req.swagger.params['visitKey'].value;
    var result = Facility.getVisit(visitKey, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.postVisitAtFacility = function postVisitAtFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var body = req.swagger.params['body'].value;
    var result = Facility.postVisitAtFacility(facilityId, body, function callback(r,e) {handleResults(r, e, res);});
};

module.exports.postVisitsAtFacility = function postVisitsAtFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var body = req.swagger.params['body'].value;
    var result = Facility.postVisitsAtFacility(facilityId, body, function callback(r,e) {handleResults(r, e, res);});
};

