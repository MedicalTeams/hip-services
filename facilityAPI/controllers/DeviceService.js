'use strict';
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var handleWithConnection = require('../../utils/connectionpool').handleWithConnection;

exports.getAllDevices = function (cb) {
    handleWithConnection(function (connection, poolcb) {
        var result = [];
        var request = new Request("SELECT mac_addr, aplctn_vrsn, itm_descn from faclty_hw_invtry", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
            }
            else {
                console.log("fetched devices " + JSON.stringify(result));
                cb(result);
            }
        });

        request.on('row', function (columns) {
            console.log("found supplemental " + columns[1].value);
            var entry = {};
            entry.uuid = columns[0].value;
            entry.appVersion = columns[1].value;
            entry.description = columns[2].value;
            result.push(entry);
            console.log(JSON.stringify(entry));
        });

        connection.execSql(request);

    });

}

exports.getDeviceByUUID = function (uuid, cb) {
    handleWithConnection(function (connection, poolcb) {
        var result;
        var request = new Request("SELECT mac_addr, aplctn_vrsn, itm_descn, hw_stat from faclty_hw_invtry" +
            " where mac_addr = @uuid", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
                cb();
            }
            else {
                console.log("fetched device " + JSON.stringify(result))
                cb(result);
            }
        });
        request.addParameter('uuid', TYPES.NVarChar, uuid);

        request.on('row', function (columns) {
            result = {};
            result.uuid = columns[0].value;
            result.applicationVersion = columns[1].value;
            result.description = columns[2].value;
            result.status = columns[3].value;
            console.log("found device " + JSON.stringify(result));
        });

        connection.execSql(request);
    });
}

exports.putDevice = function (uuid, body, cb) {

    console.log("put: " + JSON.stringify(body));
    exports.getDeviceByUUID(uuid, function (result) {
        if (typeof result !== 'undefined') {
            updateDevice(uuid, body, cb);
        }
        else {
            insertDevice(uuid, body, cb);
        }
    });

}

var insertDevice = function (uuid, body, cb) {
    var device = body;
    console.log("inserting: " + JSON.stringify(device));
    handleWithConnection(function (connection, poolcb) {
        device.uuid = uuid;
        var DEFAULT_FACILITY_ID = 5;
        var request = new Request("INSERT into faclty_hw_invtry (faclty_id, mac_addr, aplctn_vrsn, itm_descn, hw_stat) " +
            " VALUES (" + DEFAULT_FACILITY_ID + ", @uuid, @applicationVersion, @description, 'I');", function (err) {
            poolcb();
            if (err) {
                console.log("Error inserting device " + JSON.stringify(device) + ": " + err);
                return "fail"
            }
            else {
                cb(device);
            }
        });
        request.addParameter('uuid', TYPES.VarChar, device.uuid);
        request.addParameter('applicationVersion', TYPES.VarChar, device.appVersion);
        request.addParameter('description', TYPES.VarChar, device.description);


        console.log(JSON.stringify(request));
        connection.execSql(request);

    });

}


var updateDevice = function (uuid, body, cb) {
    var device = body;
    console.log("updating: " + JSON.stringify(device));
    handleWithConnection(function (connection, poolcb) {
        device.uuid = uuid;

        var request = new Request("UPDATE faclty_hw_invtry " +
            " set aplctn_vrsn = @applicationVersion, itm_descn = @description " +
            " where mac_addr = @uuid ", function (err) {
            poolcb();
            if (err) {
                console.log("the error: " + err);
                return "fail"
            }
            else {
                cb(device);
            }
        });
        request.addParameter('uuid', TYPES.NVarChar, device.uuid);
        request.addParameter('applicationVersion', TYPES.NVarChar, device.appVersion);
        request.addParameter('description', TYPES.NVarChar, device.description);

        connection.execSql(request);

    });

}
