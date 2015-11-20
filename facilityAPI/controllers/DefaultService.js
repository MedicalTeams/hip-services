'use strict';
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;
var handleWithConnection = require('../../utils/connectionpool').handleWithConnection;


console.log('connecting to ' +
    process.env.SQLAZURECONNSTR_username + '@' + process.env.SQLAZURECONNSTR_host + ':' + process.env.SQLAZURECONNSTR_database)
var config = {
    userName: 'dbadmin',
    password: 'password$1',
    server: 'mti-dev-db.database.windows.net',
    // When you connect to Azure SQL Database, you need these next options.
    options: {encrypt: true, database: 'clinic'}
};
var connection;
connection = new Connection(config);
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

exports.getFacilitiesBySettlement = function (settlement, cb) {

    var facilities = [];
    var request = new Request("SELECT faclty_id, hlth_care_faclty, setlmt, cntry, rgn from vw_lkup_faclty" +
        " where setlmt = @settlement order by user_intrfc_sort_ord", function (err) {
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

exports.getAllSettlements = function (cb) {

    var settlements = [];
    var request = new Request("SELECT setlmt, cntry, rgn, count(faclty_id) numfaclty from vw_lkup_faclty" +
        " group by setlmt, cntry, rgn", function (err) {
        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched settlements " + JSON.stringify(settlements))
            cb(settlements);
        }
    });

    request.on('row', function (columns) {
        console.log("found settlement " + columns[1].value)
        var settlement = {};
        settlement.name = columns[0].value;
        settlement.country = columns[1].value;
        settlement.region = columns[2].value;
        settlement.facilityCount = columns[3].value;
        settlements.push(settlement);
        console.log(JSON.stringify(settlement));
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

exports.getAllCitizenships = function (cb) {

    var result = [];
    var request = new Request("SELECT bnfcry_id, bnfcry from vw_lkup_bnfcry" +
        " order by user_intrfc_sort_ord", function (err) {
        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched citizenship " + JSON.stringify(result))
            cb(result);
        }
    });

    request.on('row', function (columns) {
        console.log("found diagnosis " + columns[1].value)
        var entry = {};
        entry.id = columns[0].value;
        entry.level = columns[1].value;
        result.push(entry);
        console.log(JSON.stringify(entry));
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

exports.getAllInjuryLocations = function (cb) {

    handleWithConnection( function(connection, poolcb) {
        var result = [];
        var request = new Request("SELECT splmtl_diag_cat_id, splmtl_diag_cat, diag_id from vw_lkup_injury_loc_diag" +
            " order by user_intrfc_sort_ord", function (err) {
            if (err) {
                console.log("the error: " + err);
            }
            else {
                console.log("fetched injurylocation " + JSON.stringify(result))
                cb(result);
                poolcb();
            }
        });

        request.on('row', function (columns) {
            console.log("found injury location " + columns[1].value)
            var entry = {};
            entry.id = columns[0].value;
            entry.name = columns[1].value;
            entry.diagnosis = columns[2].value;
            result.push(entry);
            console.log(JSON.stringify(entry));
        });

        connection.execSql(request);
    });
}


exports.getAllDiagnosis = function (cb) {

    var result = [];
    var request = new Request("SELECT diag_id, diag_descn from vw_lkup_diag" +
        " order by user_intrfc_sort_ord", function (err) {
        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched diagnosis " + JSON.stringify(result))
            cb(result);
        }
    });

    request.on('row', function (columns) {
        console.log("found diagnosis " + columns[1].value)
        var entry = {};
        entry.id = columns[0].value;
        entry.name = columns[1].value;
        result.push(entry);
        console.log(JSON.stringify(entry));
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

exports.getDiagnosisById = function (diagnosisId, cb) {
    var result = {};
    var request = new Request("SELECT diag_id, diag_descn from vw_lkup_diag" +
        " where diag_id = @diagnosisId", function (err) {
        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched diagnosis " + JSON.stringify(result))
            cb(result);
        }
    });
    request.addParameter('diagnosisId', TYPES.Int, diagnosisId);

    request.on('row', function (columns) {
        console.log("found diagnosis " + columns[1].value + "for id " + diagnosisId);
        result.id = columns[0].value;
        result.name = columns[1].value;
        console.log(JSON.stringify(result));
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

exports.getSupplementalById = function (supplementalId, cb) {
    var result = {};
    var request = new Request("SELECT splmtl_diag_id, splmtl_diag_descn, diag_id from vw_lkup_all_splmtl_diag" +
        " where splmtl_diag_id = @supplementalId order by user_intrfc_sort_ord", function (err) {
        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched diagnosis " + JSON.stringify(result))
            cb(result);
        }
    });
    request.addParameter('supplementalId', TYPES.Int, supplementalId);

    request.on('row', function (columns) {
        console.log("found supplemental " + columns[1].value + "for id " + supplementalId);
        result.id = columns[0].value;
        result.name = columns[1].value;
        result.diagnosis = columns[2].value;
        console.log(JSON.stringify(result));
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

exports.getSupplementalsByDiagnosis = function (diagnosisId, cb) {

    var result = [];
    var request = new Request("SELECT splmtl_diag_id, splmtl_diag_descn, diag_id from vw_lkup_all_splmtl_diag" +
        " where diag_id = @diagnosisId order by user_intrfc_sort_ord", function (err) {

        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched supplementals " + JSON.stringify(result))
            cb(result);
        }
    });
    request.addParameter('diagnosisId', TYPES.Int, diagnosisId);

    request.on('row', function (columns) {
        console.log("found supplemental " + columns[1].value)
        var entry = {};
        entry.id = columns[0].value;
        entry.name = columns[1].value;
        entry.diagnosis = columns[2].value;
        result.push(entry);
        console.log(JSON.stringify(entry));
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

exports.getAllSupplementals = function (cb) {

    var result = [];
    var request = new Request("SELECT splmtl_diag_id, splmtl_diag_descn, diag_id from vw_lkup_all_splmtl_diag" +
        " order by user_intrfc_sort_ord", function (err) {
        if (err) {
            console.log("the error: " + err);
        }
        else {
            console.log("fetched supplementals " + JSON.stringify(result))
            cb(result);
        }
    });

    request.on('row', function (columns) {
        console.log("found supplemental " + columns[1].value)
        var entry = {};
        entry.id = columns[0].value;
        entry.name = columns[1].value;
        entry.diagnosis = columns[2].value;
        result.push(entry);
        console.log(JSON.stringify(entry));
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

exports.getFacilityById = function (facilityId, cb) {
    var result = {};
    var request = new Request("SELECT faclty_id, hlth_care_faclty, setlmt, cntry, rgn from vw_lkup_faclty" +
        " where faclty_id = @facilityId", function (err) {
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

        // Populated fields that the mapping solution needs to have even if they are not relevant for this Visit.
        visit.injuryLocation = visit.injuryLocation || 0;
        visit.stiContactsTreated = visit.stiContactsTreated || 0;

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