'use strict';

var url = require('url');


var Default = require('./LookupService');


module.exports.getAllFacilities = function getAllFacilities (req, res, next) {
  var settlement = req.swagger.params['settlement'].value;
  

  var result = Default.getAllFacilities(settlement);

  if(typeof result !== 'undefined') {
      console.log(JSON.stringify(result))

      res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    console.log("no facilities found");
    res.end();
};

module.exports.getAllDiagnosis = function getAllDiagnosis (req, res, next) {
    var result = Default.getAllDiagnosis();

    if(typeof result !== 'undefined') {
        console.log(JSON.stringify(result))

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result || {}, null, 2));
    }
    else
        console.log("no diagnosis found");
    res.end();
};

module.exports.getAllSupplementals = function getAllSupplementals (req, res, next) {
    var settlement = req.swagger.params['diagnosis'].value;


    var result = Default.getAllSupplementals(diagnosis);

    if(typeof result !== 'undefined') {
        console.log(JSON.stringify(result))

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result || {}, null, 2));
    }
    else
        console.log("no supplementals found");
    res.end();
};


module.exports.getFacilityById = function getFacilityById (req, res, next) {
  var facilityId = req.swagger.params['facilityId'].value;
  

  var result = Default.getFacilityById(facilityId);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

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
  

  var result = Default.postVisitAtFacility(facilityId, body);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.postVisitsAtFacility = function postVisitsAtFacility (req, res, next) {
    var facilityId = req.swagger.params['facilityId'].value;
    var body = req.swagger.params['body'].value;


    var result = Default.postVisitsAtFacility(facilityId, body);

    if(typeof result !== 'undefined') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result || {}, null, 2));
    }
    else
        res.end();
};