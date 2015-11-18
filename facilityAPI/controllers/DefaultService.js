'use strict';
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

//var Connection = require('tedious').Connection;
//var config = {
//    userName: 'yourusername',
//    password: 'yourpassword',
//    server: 'yourserver.database.windows.net',
//    // If you are on Microsoft Azure, you need this:
//    options: {encrypt: true, database: 'AdventureWorks'}
//};
//var connection = new Connection(config);
//connection.on('connect', function(err) {
//// If no error, then good to proceed.
//    console.log("Connected");
//});


var Connection = require('tedious').Connection;
var config = {
    userName: 'dbadmin',
    password: 'password$1',
    server: 'mti-dev-db.database.windows.net',
    // When you connect to Azure SQL Database, you need these next options.
    options: {encrypt: true, database: 'Clinic'}
};
var connection = new Connection(config);
connection.on('connect', function (err) {
    if (err) {
        console.log("the error: " + err);
    }
    else {
        console.log("connected")
    }
    // If no error, then good to proceed.
    console.log("Connected");
});

exports.getAllFacilities = function (settlement, cb) {

    var facilities = [];
    var request = new Request("SELECT faclty_id, hlth_care_faclty, setlmt, cntry, rgn from vw_lkup_faclty" +
        " order by user_intrfc_sort_ord", function (err) {
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

    connection.reset(function (err) {
        if (err) {
            console.log("reset error: " + err);
            return "fail"
        }
        else {
            connection.execSql(request);
        }
    });

}


exports.getFacilityById = function (facilityId) {

    var examples = {};

    examples['application/json'] = {
        "name": "aeiou",
        "id": 123456789
    };


    if (Object.keys(examples).length > 0)
        return examples[Object.keys(examples)[0]];

}

exports.getVisitsByFacility = function (facilityId) {

    var examples = {};

    examples['application/json'] = {
        "name": "aeiou",
        "id": 123456789,
        "url": "aeiou"
    };


    if (Object.keys(examples).length > 0)
        return examples[Object.keys(examples)[0]];

}

exports.postVisitAtFacility = function (facilityId, body) {
    var visit = body;
    visit.facility = facilityId;
    visit.visitId = Date.now();

    var request = new Request("INSERT into raw_visit (visit_uuid, visit_json) " +
        " VALUES (@visituuid, @visitjson);", function(err) {
        if (err) {
            console.log("the error: " + err);
            return "fail"
        }
        else {
            connection.reset(function (err) {})
            return visit.visitId;
        }
    });
    request.addParameter('visituuid', TYPES.NVarChar, visit.visitId);
    request.addParameter('visitjson', TYPES.NVarChar , JSON.stringify(visit));


    console.log("posting: " + JSON.stringify(visit));

    connection.execSql(request);

    return visit.visitId;
}
var async = require('async');

exports.postVisitsAtFacility = function (facilityId, body) {
    var visits = body;
    var count = 0;
    async.eachSeries(visits, function(visit, callback) {
        var visit = visit;
        visit.facility = facilityId;
        visit.visitId = Date.now();
        console.log("attempt to insert " + visit.visitId);

        var request = new Request("INSERT into raw_visit (visit_uuid, visit_json) " +
            " VALUES (@visituuid, @visitjson);", function(err) {
            if (err) {
                console.log("insert error: " + err);
                return "fail"
            }
            else {
                console.log("insert complete");
                count++;
                callback();
            }
        });
        request.addParameter('visituuid', TYPES.NVarChar, visit.visitId);
        request.addParameter('visitjson', TYPES.NVarChar , JSON.stringify(visit));

        connection.reset(function (err) {
            if (err) {
                console.log("reset error: " + err);
                return "fail"
            }
            else {
                console.log("reset connection: ");
                connection.execSql(request);
            }
        });

    }, function(err){
        // if any of the visit inserts produced an error, err would equal that error
        if( err ) {
            // ToDo talk with Mick about what he would like to happen in case of error.
            console.log('One or more visit failed to be added');
        } else {
            console.log('All visits have been added');
        }
    });

    return count;
}