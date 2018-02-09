var url = require('url');
var Device = require('./DeviceService');
var common = require('./Common');
var handleResults = common.handleResults;
var getCountry = common.getCountry;

module.exports.getAllDevices = function getAllDiagnosis(req, res, next) {
    var country = getCountry(req);
	Device.getAllDevices(country, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no devices found");
        res.end();
    });
};

module.exports.getDevice = function getDevice(req, res, next) {
	var uuid = req.swagger.params['uuid'].value;
    var country = getCountry(req);
	Device.getDeviceByUUID(country, uuid, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("no such device " + uuid);
        res.end();
    });
};

module.exports.putDevice = function putDevice(req, res, next) {
    var body = req.swagger.params['body'].value;
	var uuid = req.swagger.params['uuid'].value;
    var country = getCountry(req);
	
    var result = Device.putDevice(country, uuid, body, function (result) {
        if (typeof result !== 'undefined') {
            console.log(JSON.stringify(result))
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result || {}, null, 2));
        }
        else
            console.log("failed to put device " + JSON.stringify(body));
        res.end();
    });
};