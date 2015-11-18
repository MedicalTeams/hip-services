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

exports.getAllFacilities = function (settlement) {

    var facilities = {};
    var request = new Request("SELECT faclty_id, hlth_care_faclty from lkup_faclty", function (err) {
        if (err) {
            console.log("the error: " + err);
            connection.reset;
        }
        else {
            console.log("fetched facilities")
            connection.reset;
        }
    });

    facilities['application/json'] = [];
    request.on('row', function (columns) {
        console.log("found facility " + columns[1].value)
        var facility = {};
        facility[columns[0].value] = columns[1].value;
        facilities['application/json'].push(facility);
        console.log(JSON.stringify(facilities));
    });

    connection.execSql(request);
    return facilities;


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
