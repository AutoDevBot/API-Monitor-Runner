var querystring = require('querystring');

/**
 * Sends email to Email server:
 *
 * Email server: https://github.com/AutoDevBot/Email-Notification
 *
 * @param protocol
 * @param host
 * @param endpoint
 * @param method
 * @param from
 * @param to
 * @param subject
 * @param body
 */
exports.send = function(protocol, host, endpoint, method, from, to, subject, body){

    var http_protocol = null;
    if(protocol === 'http'){
        http_protocol = require('http');
    }
    if(protocol === 'https'){
        http_protocol = require('https');
    }

    var dataString = querystring.stringify({
        'from' : from,
        'to': to,
        'subject': subject,
        'text' : body
    });

    console.log('dataString: ' + dataString);

    var headers = {
        //'Content-Type': 'application/json',
        'Content-Length': dataString.length
        //'X-Auth-Token': authToken
    };

    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = http_protocol.request(options, function(res) {
        res.setEncoding('utf-8');
        var statusCode = res.statusCode;

        var responseString = '';

        res.on('data', function(data) {
            // Collect all data as it is returned
            responseString += data;
        });

        res.on('end', function() {
            console.log('POST status code: '+statusCode);
            console.log(responseString);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request email request: ' + e.message);

        // Catch error and move on...
    });

    req.write(dataString);
    req.end();
};