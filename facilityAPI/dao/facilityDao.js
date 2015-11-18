var pool = require('./connectionpool.js');

//acquire a connection
pool.acquire(function (err, connection) {
    if (err)
        console.error(err);

    //use the connection as normal
    var request = new Request('select 42', function(err, rowCount) {
        if (err)
            console.error(err);

        console.log('rowCount: ' + rowCount);

        //release the connection back to the pool when finished
        connection.release();
    });

    request.on('row', function(columns) {
        console.log('value: ' + columns[0].value);
    });

    connection.execSql(request);
});

pool.on('error', function(err) {
    console.error(err);
});




/*
 * GET list of facilityRouter resources
 */
/*
 * GET list of facilities
 */
router.get('/', function(req, res) {

    request = new Request("SELECT faclty_id, hlth_care_faclty from lkup_faclty", function(err) {
        if (err) {
            console.log("the error: " + err);}
        else {
            console.log("fetched facilities")
            connection.reset();
            res.json(facilities);
        }
    });

    var facilities = [];
    request.on('row', function(columns) {
        console.log("found facility " + columns[1].value)
        var facility = {};
        facility[columns[0].value] = columns[1].value;
        facilities.push(facility);
        console.log(JSON.stringify(facilities));
    });

    connection.execSql(request);
});
/*
 * GET a facilityRouter resources by facilityRouter ID
 */
router.get('/:clinicId', function(req, res) {
    var cid = req.params.clinicId;
    res.json({ cid: 'This is a facilityRouter details object'});
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

router.post('/:clinicId/visit/upload', function(req, res) {
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
    

