'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.getAllFacilities = function getAllFacilities (req, res, next) {
  var settlement = req.swagger.params['settlement'].value;
  
  Default.getAllFacilities(settlement, function(result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no facilities found");
        res.end();
    });
};

module.exports.getAllSettlements = function getAllSettlements (req, res, next) {
    Default.getAllSettlements(function(result) {
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

module.exports.getAllCitizenships = function getAllCitizenships (req, res, next) {
    Default.getAllCitizenships(function(result) {
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


module.exports.getAllInjuryLocations = function getAllInjuryLocations (req, res, next) {
    Default.getAllInjuryLocations(function(result) {
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

module.exports.getAllDiagnosis = function getAllDiagnosis (req, res, next) {
    Default.getAllDiagnosis(function(result) {
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


module.exports.getAllSupplementals = function getAllSupplementals (req, res, next) {
    var diagnosisId = req.swagger.params.diagnosis.value;
    if (typeof diagnosisId !== 'undefined') {
        Default.getSupplementalsByDiagnosis(diagnosisId, function(result) {
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
        Default.getAllSupplementals( function(result) {
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


module.exports.getSupplementalById = function getSupplementalById (req, res, next) {
    var supplementalId = req.swagger.params['supplementalId'].value;
    Default.getSupplementalById(supplementalId, function(result) {
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

module.exports.getDiagnosisById = function getDiagnosisById (req, res, next) {
    var diagnosisId = req.swagger.params['diagnosisId'].value;
    Default.getDiagnosisById(diagnosisId, function(result) {
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

module.exports.getSupplementalsByDiagnosis = function getSupplementalsByDiagnosis (req, res, next) {
    var diagnosisId = req.swagger.params['diagnosisId'].value;
    Default.getSupplementalsByDiagnosis(diagnosisId, function(result) {
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

module.exports.getFacilitiesBySettlement = function getFacilitiesBySettlement (req, res, next) {
    var settlement = req.swagger.params['settlement'].value;
    Default.getFacilitiesBySettlement(settlement, function(result) {
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

module.exports.getFacilityById = function getFacilityById (req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var result = Default.getFacilityById(facilityId, function (result) {
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

module.exports.getVisitsByFacility = function getVisitsByFacility (req, res, next) {
  var facilityId = req.swagger.params['facilityId'].value;
  

  var result = Default.getVisitsByFacility(facilityId);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.postVisitAtFacility = function postVisitAtFacility (req, res, next) {
  var facilityId = req.swagger.params['facilityId'].value;
  var body = req.swagger.params['body'].value;
  

  var result = Default.postVisitAtFacility(facilityId, body, function (result) {
      if (typeof result !== 'undefined') {
          console.log(JSON.stringify(result))
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result || {}, null, 2));
      }
      else
          console.log("no such facility " + facilityId);
      res.end();
  });
};

module.exports.postVisitsAtFacility = function postVisitsAtFacility (req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var body = req.swagger.params['body'].value;


    var result = Default.postVisitsAtFacility(facilityId, body, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no such facility " + facilityId);
        res.end();
    });
};


module.exports.getAllDevices = function getAllDiagnosis (req, res, next) {
    Default.getAllDevices(function(result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no devices found");
        res.end();
    });
};

module.exports.putDevice = function putDevice (req, res, next) {
    var body = req.swagger.params['body'].value;
    var uuid = req.swagger.params['uuid'].value;

    var result = Default.putDevice(uuid, body, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("failed to put device " + JSON.stringify(body));
        res.end();
    });
};