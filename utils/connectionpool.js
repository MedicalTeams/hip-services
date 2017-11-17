var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

var poolConfig = {
    min: 2,
    max: 10,
    log: true
};

var pool = [];

var countries = process.env.countries.split(",");

for (var country in countries) {
	var connectionConfig = {
		userName: process.env[country +"_SQLAZURECONNSTR_username"],
		password: process.env.[country +"_SQLAZURECONNSTR_password"],
		server: process.env.[country +"_SQLAZURECONNSTR_host"],
		// Needed for Microsoft Azure
		options: {
			encrypt: true, database: process.env.[country+"_SQLAZURECONNSTR_database "]
		}
	};

	console.log("connecting to " + JSON.stringify(connectionConfig.server));

	//create the pool
	pool[country] = new ConnectionPool(poolConfig, connectionConfig);

	pool[country].on('error', function (err) {
		console.error(err);
	});
}

exports.handleWithConnection = function(country,handleStatement) {
    pool[country].acquire( function (err, connection) {
        if (err)
            console.error(err);
        return handleStatement(connection, function() {
            var releaseinfo = connection.release();
        })
    });
}



