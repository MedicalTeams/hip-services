'use strict';
var url = require('url');
var Lookup = require('./LookupService');
var Facility = require('./FacilityService');
var common = require('./Common');
var handleResults = common.handleResults;
var getCountry = common.getCountry;

module.exports.getAllSettlements = function getAllSettlements(req, res, next) {
	var country = getCountry(req);
	Lookup.getAllSettlements(country, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no Settlements found");
        res.end();
    });
};

module.exports.getAllCitizenships = function getAllCitizenships(req, res, next) {
	var country = getCountry(req);
	Lookup.getAllCitizenships(country, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no citizenships found");
        res.end();
    });
};


module.exports.getAllInjuryLocations = function getAllInjuryLocations(req, res, next) {
	var country = getCountry(req);
    Lookup.getAllInjuryLocations(country, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no injury locations found");
        res.end();
    });
};

module.exports.getAllDiagnosis = function getAllDiagnosis(req, res, next) {
	var country = getCountry(req);
    Lookup.getAllDiagnosis(country, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no diagnosis found");
        res.end();
    });
};


module.exports.getAllSupplementals = function getAllSupplementals(req, res, next) {
	var diagnosisId = req.swagger.params.diagnosis.value;
	var country = getCountry(req);
    if (typeof diagnosisId !== 'undefined') {
        Lookup.getSupplementalsByDiagnosis(country, diagnosisId, function (result) {
            if (typeof result !== 'undefined') {
                console.log(JSON.stringify(result))
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result || {}, null, 2));
            }
            else
                console.log("no such diagnosis " + diagnosisId);
            res.end();
        });
    }
    else {
        Lookup.getAllSupplementals(country, function (result) {
            if (typeof result !== 'undefined') {
                console.log(JSON.stringify(result))

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result || {}, null, 2));
            }
            else
                console.log("no supplementals found");
            res.end();
        });
    }
};


module.exports.getSupplementalById = function getSupplementalById(req, res, next) {
	var supplementalId = req.swagger.params['supplementalId'].value;
	var country = getCountry(req);
    Lookup.getSupplementalById(country, supplementalId, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no supplemental found");
        res.end();
    });
};

module.exports.getDiagnosisById = function getDiagnosisById(req, res, next) {
	var diagnosisId = req.swagger.params['diagnosisId'].value;
	var country = getCountry(req);
    Lookup.getDiagnosisById(country, diagnosisId, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no diagnosis found");
        res.end();
    });
};

module.exports.getSupplementalsByDiagnosis = function getSupplementalsByDiagnosis(req, res, next) {
	var diagnosisId = req.swagger.params['diagnosisId'].value;
	var country = getCountry(req);
    Lookup.getSupplementalsByDiagnosis(country, diagnosisId, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no such diagnosis " + diagnosisId);
        res.end();
    });
};


module.exports.getFacilitiesBySettlement = function getFacilitiesBySettlement(req, res, next) {
	var settlement = req.swagger.params['settlement'].value;
	var country = getCountry(req);
    Facility.getFacilitiesBySettlement(country, settlement, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no such settlement " + settlement);
        res.end();
    });
};
