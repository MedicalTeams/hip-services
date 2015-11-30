'use strict';
var url = require('url');
var Lookup = require('./LookupService');
var common = require('./Common');
var handleResults = common.handleResults;

module.exports.getAllSettlements = function getAllSettlements(req, res, next) {
    Lookup.getAllSettlements(function (result) {
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
    Lookup.getAllCitizenships(function (result) {
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
    Lookup.getAllInjuryLocations(function (result) {
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
    Lookup.getAllDiagnosis(function (result) {
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
    if (typeof diagnosisId !== 'undefined') {
        Lookup.getSupplementalsByDiagnosis(diagnosisId, function (result) {
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
        Lookup.getAllSupplementals(function (result) {
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
    Lookup.getSupplementalById(supplementalId, function (result) {
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
    Lookup.getDiagnosisById(diagnosisId, function (result) {
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
    Lookup.getSupplementalsByDiagnosis(diagnosisId, function (result) {
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
