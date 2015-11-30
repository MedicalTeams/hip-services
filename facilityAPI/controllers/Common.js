'use strict';

module.exports.handleResults = function(result, error, res){
    if (typeof error === 'undefined' && typeof result !== 'undefined') {
        console.log(JSON.stringify(result))
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result || {}, null, 2));
    }
    else {
        // Something bad happened
        console.log(JSON.stringify(error));
        res.writeHead(error, JSON.stringify(result), {'Content-Type': 'application/json'});
        res.end();
    }
}


module.exports.b64 = function (input) {
    var b = new Buffer(JSON.stringify(input));
    return b.toString('base64');
}