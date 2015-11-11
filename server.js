var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('./utils/logger');

// setup apps to have access to the bodyParser() features for parsing POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Base Routing
var baserouter = express.Router();
baserouter.get('/', function(req,res) {
   res.json({ message: 'HIP Services found here' });
});

// Register Routes
app.use('/', baserouter);

var clinic = require('./clinicAPI/routes/clinic');
clinic.connection = app.use('/clinic', clinic);


var resolved_port = process.env.PORT || 3000;
var server = app.listen( resolved_port, function () {
   var host = server.address().address;
   var port = server.address().port;



   console.log('Example app listening at http://%s:%s', host, port);
});

