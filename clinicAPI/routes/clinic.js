var express = require('express');
var router = express.Router();
var logger = require('../../utils/logger');

// middleware for logging
router.use(function timeLog(req, res, next) {
    //logger.info(req);
    next();
});


// Connection Stuff... move to it's own.
var Connection = require('tedious').Connection;
var config = {
    userName: 'dbadmin',
    password: 'password$1',
    server: 'mti-dev-db.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'Clinic'}
};
var connection = new Connection(config);
connection.on('connect', function(err) {
    // If no error, then good to proceed.
    console.log("Connected");
});
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

/*
 * GET list of clinic resources
 */
 router.get('/', function(req, res) {
    res.json('["clinic1","clinic2","clinic3"]');
    });

/*
 * GET a clinic resources by clinic ID
 */
router.get('/:clinicId', function(req, res) {
    var cid = req.params.clinicId;
    res.json({ cid: 'This is a clinic details object'});
});

router.get('/:clinicId/visit/:visitId', function(req, res) {
    var cid = req.params.clinicId;
    var vid = req.params.visitId;
    request = new Request("SELECT visit_json from raw_visit" +
        " WHERE visit_uuid = @visituuid;", function(err) {
        if (err) {
            console.log("the error: " + err);}
    });
    request.addParameter('visituuid', TYPES.NVarChar, vid);

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                res.json(column.value);
            } else {
                res.json(column.value);
            }
        });
    });

    request.on('done', function(rowCount, more, rows) {
       if (rowCount === 0){
           res.status(404).json({ warning: 'The requested visit ' + vid + ' does not exist'})
       }
        connection.reset();
    });

    connection.execSql(request);

});

router.post('/:clinicId/visit', function(req, res) {
    res.json( insertVisit(req.params.clinicId, req.body) );
});


function insertVisit(clinicId, visit) {
    visit.clinicId = clinicId;
    visit.visitId = Date.now();

    request = new Request("INSERT into raw_visit (visit_uuid, visit_json) " +
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

    connection.execSql(request);

    return visit.visitId;
}


module.exports = router;
    

