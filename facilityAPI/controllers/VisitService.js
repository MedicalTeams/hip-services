'use strict';
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var handleWithConnection = require('../../utils/connectionpool').handleWithConnection;
var Device = require('./DeviceService');
var Common = require('./Common');

exports.postVisit = function (body, cb) {
    handleWithConnection(function (connection, poolcb) {
        var visit = body;
        visit.key = Common.b64({deviceId: visit.deviceId, visitDate: visit.visitDate});
        visit.injuryLocation = visit.injuryLocation || 0;  // post processing requires this to be non-null
        visit.stiContactsTreated = visit.stiContactsTreated || 0;  // post processing requires this to be non-null

        var request = new Request("INSERT into raw_visit (visit_uuid, visit_json) " +
            " VALUES (@visituuid, @visitjson);", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
                if (err.number === 2627) {
                    visit.status = 2; // duplicate
                    cb(visit, [409, "Rejecting the post of a visit that has already been posted.  " +
                    "raw_visit.visit_uuid = '" + visit.key + "'"]);
                } else {
                    visit.status = 3; // failure that can (should) be retried.
                    cb(visit, [400, err]);
                }
            }
            else {
                visit.status = 1; // successfully uploaded
                cb(visit);
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
                visit.status = 4;  // failure that can (should) be retried.
                cb(visit, [403, "fail - device is not registered"]);
            }
        });
    });

}

var async = require('async');

exports.postVisits = function (body, cb) {
    var visits = body;
    var count = 0;

    var rollupresults = [];
    async.eachSeries(visits, function (visit, visitDone) {
        var visit = visit;
        exports.postVisit(visit, function (result, error) {
            rollupresults.push(result);
            visitDone();
        });
    }, function (err) {
        if (err) {
            cb(visit, [400, "failed to POST visits"]);
        }
        else {
            cb(visits);
        }
    });

}

