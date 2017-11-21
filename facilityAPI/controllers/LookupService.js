'use strict';
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var handleWithConnection = require('../../utils/connectionpool').handleWithConnection;

exports.getAllSettlements = function (country, cb) {

	handleWithConnection(country, function (connection, poolcb) {
        var settlements = [];
        var request = new Request("SELECT setlmt, cntry, rgn, count(faclty_id) numfaclty from vw_lkup_faclty" +
            " group by setlmt, cntry, rgn", function (err) {
            poolcb();
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
        connection.execSql(request);
	}, cb);

}

exports.getAllCitizenships = function (country, cb) {

	handleWithConnection(country, function (connection, poolcb) {
        var result = [];
        var request = new Request("SELECT bnfcry_id, bnfcry from vw_lkup_bnfcry" +
            " order by user_intrfc_sort_ord", function (err) {
            poolcb();
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

        connection.execSql(request);

	}, cb);

}

exports.getAllInjuryLocations = function (country, cb) {

	handleWithConnection(country, function (connection, poolcb) {
        var result = [];
        var request = new Request("SELECT splmtl_diag_cat_id, splmtl_diag_cat, diag_id from vw_lkup_injury_loc_diag" +
            " order by user_intrfc_sort_ord", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
            }
            else {
                console.log("fetched injurylocation " + JSON.stringify(result))
                cb(result);
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
	}, cb);
}


exports.getAllDiagnosis = function (country, cb) {

	handleWithConnection(function (country, connection, poolcb) {
        var result = [];
        var request = new Request("SELECT diag_id, diag_descn from vw_lkup_diag" +
            " order by user_intrfc_sort_ord", function (err) {
            poolcb();
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


        connection.execSql(request);

	}, cb);


}

exports.getDiagnosisById = function (country, diagnosisId, cb) {
	handleWithConnection(country, function (connection, poolcb) {
        var result = {};
        var request = new Request("SELECT diag_id, diag_descn from vw_lkup_diag" +
            " where diag_id = @diagnosisId", function (err) {
            poolcb();
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


        connection.execSql(request);

	}, cb);

}

exports.getSupplementalById = function (country, supplementalId, cb) {
	handleWithConnection(country, function (connection, poolcb) {
        var result = {};
        var request = new Request("SELECT splmtl_diag_id, splmtl_diag_descn, diag_id from vw_lkup_base_splmtl_diag" +
            " where splmtl_diag_id = @supplementalId order by user_intrfc_sort_ord", function (err) {
            poolcb();
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


        connection.execSql(request);

	}, cb);

}

exports.getSupplementalsByDiagnosis = function (country, diagnosisId, cb) {
	handleWithConnection(country, function (connection, poolcb) {
        var result = [];
        var request = new Request("SELECT splmtl_diag_id, splmtl_diag_descn, diag_id from vw_lkup_base_splmtl_diag" +
            " where diag_id = @diagnosisId order by user_intrfc_sort_ord", function (err) {
            poolcb();
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


        connection.execSql(request);

	}, cb);

}

exports.getAllSupplementals = function (country, cb) {
	handleWithConnection(country, function (connection, poolcb) {
        var result = [];
        var request = new Request("SELECT splmtl_diag_id, splmtl_diag_descn, diag_id from vw_lkup_base_splmtl_diag" +
            " order by user_intrfc_sort_ord", function (err) {
            poolcb();
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


        connection.execSql(request);

	}, cb);

}

