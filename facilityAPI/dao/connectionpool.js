var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

var poolConfig = {
    min: 2,
    max: 10,
    log: true
};

var connectionConfig = {
    userName: 'dbadmin',
    password: 'password$1',
    server: 'mti-dev-db.database.windows.net',
    // Needed for Microsoft Azure
    options: {encrypt: true, database: 'Clinic'}
};

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

//create the pool
module.exports = new ConnectionPool(poolConfig, connectionConfig);
