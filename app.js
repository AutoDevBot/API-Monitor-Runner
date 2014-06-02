/**
 * This server deals with running Frisby.js tests.
 *
 * Endpoints:
 * /pullCode - this endpoint instructs the server to pull code from github.
 * /executeMonitorFrisby - this endpoints instructs the server to run the Frisby.js tests and then send
 *                          the results into the raw_monitoring_results queue
 * /testEndpoint - test endpoint to make sure the server is up and running
 *
 *
 * Starting server:
 * -You will have to export an environment variable with the name of one of the configs:
 *      export NODE_ENV=default    -used to pull environment config
 *      export USER_ID=1234        -used to subscried to a Redis channel to bootstrap this container to pullCode
 *
 * Directory access and dependancies
 * -This worker needs write permission to /opt - it will put and delete the "repo" directory at this location
 * -This working will output the xml result to: /tmp/frisby_output/
 * -Frisby.js lib is expected at this location: /opt/AutoDevBotContainerNodes/node_modules/frisby/lib/frisby.js
 *
 */

var CONFIG = require('config').frisbyRunner;
var http    = require('http'),
    express = require('express');
var shell = require('shelljs');
var async = require('async');
var executeMonitor = require('./lib/ExecuteMonitor.js');
var repository = require('./lib/repository.js');

var PORT = CONFIG.port,
    HOST = CONFIG.host;

var app = express();
app.use(express.bodyParser());


// TODO: put this path in the config file so that it can be changed for each environment
var frisby_path = 'not_used';

// User data holding info needed to run this container
// data: {"user_id":"b9e45b2320a544b8b017fbf60fb04247","github_url":"https://github.com/AutoDevBot/monitor-examples.git","oauth_token":"1234","username":"garland2","email":"garland@example.org"}
var userData = new Object();

// Holds persistent data on file system
var persistent_data_file = './AutoDevBot_userData.txt';
var repository_path = '/opt/repo';
var result_output_path = '/tmp/frisby_output/';

userData = checkPersistentData(shell, persistent_data_file);
console.log('Setting user data to:');
console.log(userData);


/**
 * Interval to hit the test interface to kick off a test.
 *
 * TODO: make the interval time user settable.  Probably should also add another endpoint
 * to listen for a broadcast for an "on demand" test.
 */
var intervalRunTests;
intervalRunTests = setInterval(function(){
    shell.exec('curl -s -X POST http://localhost:'+PORT+'/executeMonitorFrisby > /dev/null', function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
    });
}, 60000);


/**
 *  -Pull new code into the local servers directory
 *  -Output userData to disk
 *
 *  -input: github_url, oauth_token, user_id, username, email
 */
function pullCode(){

    repository.setGithubURL(userData.github_url);
    repository.setOauthToken(userData.oauth_token);
    repository.setRepoPath(repository_path);

    async.series([
            function(callback){
                // Remove current repository
                repository.remove(function(err, result){
                    if(result){
                        callback(null, true);
                    }else{
                        callback(null, false);
                    }
                });
            },
            function(callback){
                // Clone repository
                repository.clone(function(err, result){
                    if(result){
                        callback(null, true);
                    }else{
                        callback(null, false);
                    }
                });
            },
            function(callback){
                // Run npm install in repository
                repository.runNPMInstall(function(err, result){
                    if(result){
                        callback(null, true);
                    }else{
                        callback(null, false);
                    }
                })
            }
        ],
        // optional callback
        function(err, results){
            console.log(results);
        });
};


/**
 * Executes the local Frisby.js code and puts the results into a the "<env>_raw_monitoring_results"
 * job queue.
 *
 * -input: <>
 */
app.post('/executeMonitorFrisby', function (req, res) {

    executeMonitor.setRepoPath(repository_path);
    executeMonitor.setResultOutputDir(result_output_path);

    async.series([
            function(callback){
                // Check if directory exists

                executeMonitor.doesExecuteRepoExist(function(err, result){
                   if(result){
                       callback(null, true);
                   }else{
                       callback(null, false);
                   }
                });
            },
            function(callback){
                // Remove old test results
                executeMonitor.removePreviousTestResults(function(err, result){
                    if(result){
                        callback(null, true);
                    }else{
                        callback(null, false);
                    }
                });
            },
            function(callback){
                // Run the Frisby.js test
                executeMonitor.runFrisbyjsTests(function(err, result){
                    if(result){
                        callback(null, true);
                    }else{
                        callback(null, false);
                    }
                });
            },
            function(callback){
                // Get the test results
                executeMonitor.getResults(function(err, results){
                   if(err !== null){
                       console.log(results);
                   }else{
                       // Error
                       console.log(results);
                   }
                });
            }
        ],
        // optional callback
        function(err, results){
            console.log(results);
        });

});



//
// Create HTTP server
//
server = http.createServer(app);

server.listen(PORT, HOST, null, function() {
    console.log('Server listening on port %d in %s mode', PORT, app.settings.env);
});

/**
 * Check if the file which is holding the persistent data is on the file system.
 * If so, return those values.
 *
 * @param shell
 * @param userDataFilePath
 * @returns {*}
 */
function checkPersistentData(shell, userDataFilePath){

    if (shell.test('-f', userDataFilePath)){
        console.log('File exist: '+userDataFilePath);

        // Read file
        var userDataObj = JSON.parse(shell.cat(userDataFilePath));

        return userDataObj;

    }else{
        console.log('File does not exist: '+userDataFilePath);

        return {};
    }
}

// Run pull code on startup
pullCode();