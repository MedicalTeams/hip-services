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

//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function(err) {
    console.error(err);
});

exports.handleWithConnection = function(handleStatement) {
    pool.acquire( function (err, connection) {
        if (err)
            console.error(err);

        console.log("connection aquired)");
        return handleStatement(connection, function() {
            connection.release();
            console.log("connection released");
        })
    });
}



