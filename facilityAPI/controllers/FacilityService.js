'use strict';
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var handleWithConnection = require('../../utils/connectionpool').handleWithConnection;
var Device = require('./DeviceService');
var Common = require('./Common');

exports.getAllFacilities = function (cb) {

    return handleWithConnection(function (connection, poolcb) {
        var facilities = [];
        var request = new Request("SELECT faclty_id, hlth_care_faclty, setlmt, cntry, rgn from vw_lkup_faclty" +
            " order by user_intrfc_sort_ord", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
            }
            else {
                console.log("fetched facilities " + JSON.stringify(facilities))
                cb(facilities);
            }
        });

        request.on('row', function (columns) {
            console.log("found facility " + columns[1].value)
            var facility = {};
            facility.id = columns[0].value;
            facility.name = columns[1].value;
            facility.settlement = columns[2].value;
            facility.country = columns[3].value;
            facility.region = columns[4].value;
            facilities.push(facility);
            console.log(JSON.stringify(facility));
        });

        connection.execSql(request);
    });

}


exports.getFacilityById = function (facilityId, cb) {
    handleWithConnection(function (connection, poolcb) {
        var result = {};
        var request = new Request("SELECT faclty_id, hlth_care_faclty, setlmt, cntry, rgn from vw_lkup_faclty" +
            " where faclty_id = @facilityId", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
            }
            else {
                console.log("fetched facilities " + JSON.stringify(result))
                cb(result);
            }
        });
        request.addParameter('facilityId', TYPES.Int, facilityId);

        request.on('row', function (columns) {
            console.log("found facility " + columns[1].value)
            result.id = columns[0].value;
            result.name = columns[1].value;
            result.settlement = columns[2].value;
            result.country = columns[3].value;
            result.region = columns[4].value;
            console.log(JSON.stringify(result));
        });

        connection.execSql(request);
    });
}


exports.getVisitsByFacility = function (facilityId) {
    handleWithConnection(function (connection, poolcb) {
        var examples = {};

        examples['application/json'] = {
            "name": "aeiou",
            "id": 123456789,
            "url": "aeiou"
        };


        if (Object.keys(examples).length > 0)
            return examples[Object.keys(examples)[0]];
    });

}


exports.getVisit = function (visitKey, cb) {
    handleWithConnection(function (connection, poolcb) {
        var result = {};
        var request = new Request("SELECT  visit_json FROM raw_visit" +
            " where visit_uuid = @visitKey", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
                cb(result, err);
            }
            else {
                console.log("fetched visits " + JSON.stringify(result))
                cb(result);
            }
        });
        request.addParameter('visitKey', TYPES.NVarChar, visitKey);

        request.on('row', function (columns) {
            console.log("found visit " + visitKey)
            result = columns[0].value;
            console.log(result);
        });

        connection.execSql(request);
    });
}

exports.postVisitAtFacility = function (facilityId, body, cb) {
    handleWithConnection(function (connection, poolcb) {
        var visit = body;
        visit.facility = facilityId;
        visit.key = Common.b64({deviceId: visit.deviceId, visitDate: visit.visitDate});
        visit.injuryLocation = visit.injuryLocation || 0;  // post processing requires this to be non-null
        visit.stiContactsTreated = visit.stiContactsTreated || 0;  // post processing requires this to be non-null

        var request = new Request("INSERT into raw_visit (visit_uuid, visit_json) " +
            " VALUES (@visituuid, @visitjson);", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
                if (err.number === 2627) {
                    cb(visit.key, [409, "Rejecting the post of a visit that has already been posted.  " +
                    "raw_visit.visit_uuid = '" + visit.key + "'"]);
                } else {
                    cb(visit.key, [400, err]);
                }
            }
            else {
                cb(visit.key);
            }
        });
        request.addParameter('visituuid', TYPES.NVarChar, visit.key);
        request.addParameter('visitjson', TYPES.NVarChar, JSON.stringify(visit));
        console.log("posting: " + JSON.stringify(visit));

        Device.getDeviceByUUID (visit.deviceId, function (result) {
            if (typeof result !== 'undefined' && result.status === 'A') {
                connection.execSql(request);
            }
            else {
                cb({"error": "fail - device is not registered"}, 400);
            }
        });
    });

}

var async = require('async');

exports.postVisitsAtFacility = function (facilityId, body, cb) {
    var visits = body;
    var count = 0;

    var rollupresults = {successfulVisits: [], failedVisits: []};
    async.eachSeries(visits, function (visit, visitDone) {
        var visit = visit;
        exports.postVisitAtFacility(facilityId, visit, function (result, error) {
            if (error) {
                rollupresults.failedVisits.push({key: result, error: error});
            } else {
                rollupresults.successfulVisits.push(result);
            }
            visitDone();
        });
    }, function (err) {
        if (err) {
            cb({"error": "failed to POST visits"}, 400);
        }
        else {
            cb(rollupresults);
        }
    });

}


exports.getFacilitiesBySettlement = function (settlement, cb) {

    handleWithConnection(function (connection, poolcb) {
        var facilities = [];
        var request = new Request("SELECT faclty_id, hlth_care_faclty, setlmt, cntry, rgn from vw_lkup_faclty" +
            " where setlmt = @settlement order by user_intrfc_sort_ord", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
            }
            else {
                console.log("fetched facilities " + JSON.stringify(facilities))
                cb(facilities);
            }
        });

        request.on('row', function (columns) {
            console.log("found facility " + columns[1].value)
            var facility = {};
            facility.id = columns[0].value;
            facility.name = columns[1].value;
            facility.settlement = columns[2].value;
            facility.country = columns[3].value;
            facility.region = columns[4].value;
            facilities.push(facility);
            console.log(JSON.stringify(facility));
        });

        request.addParameter('settlement', TYPES.NVarChar, decodeURIComponent(settlement));

        connection.execSql(request);
    });
}
