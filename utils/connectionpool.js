var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

var poolConfig = {
    min: 2,
    max: 10,
    log: true
};

var connectionConfig = {
    userName: process.env.SQLAZURECONNSTR_username,
    password: process.env.SQLAZURECONNSTR_password,
    server: process.env.SQLAZURECONNSTR_host,
    // Needed for Microsoft Azure
    options: {encrypt: true, database: process.env.SQLAZURECONNSTR_database}
};

console.log( "connecting to " + JSON.stringify(connectionConfig.server) );

//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function(err) {
    console.error(err);
});

exports.handleWithConnection = function(handleStatement) {
    pool.acquire( function (err, connection) {
        if (err)
            console.error(err);
        console.log("connection aquired for " + JSON.stringify(connection));
        return handleStatement(connection, function() {
            var releaseinfo = connection.release();
        })
    });
}



