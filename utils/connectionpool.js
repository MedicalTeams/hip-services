var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

var poolConfig = {
    min: 2,
    max: 10,
    log: true
};

var pool = [];

var countries = process.env.countries.split(",");

for (var i = 0, len = countries.length; i < len; i++) {
	var country = countries[i];
	var connectionConfig = {
		userName: process.env["SQLAZURECONNSTR_username_" + country],
		password: process.env["SQLAZURECONNSTR_password_" + country],
		server: process.env["SQLAZURECONNSTR_host_" + country],
		// Needed for Microsoft Azure
		options: {
			encrypt: true, database: process.env["SQLAZURECONNSTR_database_" + country]
		}
	};

	console.log("connecting to " + country + " with connection" + JSON.stringify(connectionConfig));

	//create the pool
	pool[country] = new ConnectionPool(poolConfig, connectionConfig);

	pool[country].on('error', function (err) {
		console.error(err);
	});
}

exports.handleWithConnection = function (country, handleStatement, error) {
	console.log(country);
	if (!pool.hasOwnProperty(country)) {
		error(400, "Country "+ country + " not found");
	}
    pool[country].acquire( function (err, connection) {
        if (err)
			error(500, err);
        return handleStatement(connection, function() {
            var releaseinfo = connection.release();
        })
    });
}



