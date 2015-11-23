'use strict';
var bodyParser = require('body-parser');
var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
//var logger = require('./utils/logger');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

// setup apps to have access to the bodyParser() features for parsing POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var serverPort = process.env.PORT || 8080;

// swaggerRouter configuration
var options = {
    swaggerUi: '/swagger.json',
    controllers: './facilityAPI/controllers',
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var swaggerDoc = require('./facilityAPI/swagger.json');

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // Start the server
    http.createServer(app).listen(serverPort, function () {
        console.log( swaggerDoc.info.title + ": " + swaggerDoc.info.description );
        console.log( "Service Version: " + swaggerDoc.info.version );
        console.log( "Access services at HTTP://" + JSON.stringify( swaggerDoc.host + swaggerDoc.basePath ) );
    });
});
