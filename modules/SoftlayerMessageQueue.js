/**
 * Node.js Module to interact with Softlayer Message Queue
 *
 */

var https = require('https');

var host = '';
var account_id = '5yeay';
var authToken = '';

/**
 * Auth Token
 *
 * @param string
 */
exports.setAuthToken = function(string){
    authToken = string;
}
exports.setHost = function(string){
    host = string;
}
exports.setAccountId = function(string){
    account_id = string;
}

/**
 * Post a message to a queue
 *
 * http://sldn.softlayer.com/reference/Message-Queue
 *
 * @param queueName
 * @param messageObject
 */
exports.queuesPOST = function(queueName, messageObject){

    var endpoint = '/v1/'+account_id+'/queues/'+queueName+'/messages';
    var method = 'POST';

    var dataString = JSON.stringify(messageObject);

    console.log('dataString: ' + dataString);

    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
        'X-Auth-Token': authToken
    };

    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');
        var statusCode = res.statusCode;

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log('queuesPOST status code: '+statusCode);
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            //success(responseObject);
        });
    });

    req.write(dataString);
    req.end();
}

/**
 * Get/pop a message from a queue
 * http://sldn.softlayer.com/reference/Message-Queue
 *
 * return data:
 *
 * { item_count: 1,
  items:
   [ { id: 'bea143adb670d19253ddad59109b5b28',
       body: '<?xml version="1.0" encoding="UTF-8" ?>\n<testsuites>\n<testsuite name="Frisby Test: User POST" errors="0" tests="1" failures="1" time="0.063" timestamp="2014-02-08T16:31:52">\n  <testcase classname="Frisby Test: User POST" name="\n\t[ POST https://api.AutoDevBot.com/user ]" time="0.063"><failure>1: Expected 500 to equal 201. 2: Error: Header &apos;content-type&apos; not present in HTTP response</failure></testcase>\n</testsuite>\n</testsuites>',
       fields: null,
       visibility_delay: 0,
       visibility_interval: 60,
       initial_entry_time: 1391905913.136437 } ] }
 *
 *
 * @param queueName
 */
exports.queuesGET = function(queueName, batchNumber, callback){

    var endpoint = '/v1/'+account_id+'/queues/'+queueName+'/messages?batch='+batchNumber;
    var method = 'GET';

    var headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken
    };

    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            //console.log(responseString);
            var responseObject = JSON.parse(responseString);
            callback(responseObject);
        });
    });

    //req.send();
    req.end();
}

exports.queuesDELETE = function(queueName, msgId){

    var endpoint = '/v1/'+account_id+'/queues/'+queueName+'/messages/'+msgId;
    var method = 'DELETE';

    var headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken
    };

    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');
        var statusCode = res.statusCode;

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {

            console.log('Delete status: '+statusCode);

            if(statusCode != 202){
                console.log('Error on queue delete');
            }
        });
    });

    //req.send();
    req.end();
}