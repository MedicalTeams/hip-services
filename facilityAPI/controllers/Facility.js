'use strict';
var url = require('url');
var Facility = require('./FacilityService');
var common = require('./Common');
var handleResults = common.handleResults;

module.exports.getAllFacilities = function getAllFacilities(req, res, next) {
    var settlement = req.swagger.params['settlement'].value;

    var callback = function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no facilities found");
        res.end();
    };

    if (typeof settlement !== 'undefined')
        Facility.getFacilitiesBySettlement(settlement, callback);
    else
        Facility.getAllFacilities(callback);

};

module.exports.getFacilityById = function getFacilityById(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var result = Facility.getFacilityById(facilityId, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no such facility " + facilityId);
        res.end();
    });
}

module.exports.getVisitsByFacility = function getVisitsByFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;


    var result = Facility.getVisitsByFacility(facilityId);

    if (typeof result !== 'undefined') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result || {}, null, 2));
    }
    else
        res.end();
};


module.exports.getVisit = function getVisitsByFacility(req, res, next) {
    var visitKey = req.swagger.params['visitKey'].value;
    var result = Facility.getVisit(visitKey, function (result) {
        if (typeof result !== 'undefined') {
            console.log(result)
            res.setHeader('Content-Type', 'application/json');
            res.end(result || {}, null, 2);
        }
        else
            console.log("no such visit " + visitKey);
        res.end();
    });
};

module.exports.postVisitAtFacility = function postVisitAtFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var body = req.swagger.params['body'].value;

    var result = Facility.postVisitAtFacility(facilityId, body, function(result, error){
        handleResults(result, error, res);
    });
};

module.exports.postVisitsAtFacility = function postVisitsAtFacility(req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var body = req.swagger.params['body'].value;

    var result = Facility.postVisitsAtFacility(facilityId, body, function(result, error){
        handleResults(result, error, res);
    });
};

