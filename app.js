/**
 * This server deals with running Frisby.js tests.
 *
 * Endpoints:
 * /pullCode - this endpoint instructs the server to pull code from github.
 * /executeMonitorFrisby - this endpoints instructs the server to run the Frisby.js tests and then send
 *                          the results into the raw_monitoring_results queue
 * /testEndpoint - test endpoint to make sure the server is up and running
 *
 */

var conf = require('./config.js');
var http    = require('http'),
    express = require('express');
var shell = require('shelljs');
var async = require('async');
var executeMonitor = require('./lib/ExecuteMonitor.js');
var repository = require('./lib/repository.js');
var resultHandler = require('./lib/results.js');

// Setup Params
var PORT = conf.SERVER_PORT || process.env.SERVER_PORT,
    HOST = conf.SERVER_HOST || process.env.SERVER_HOST,
    github_url = conf.GITHUB_URL || process.env.GITHUB_URL,
    github_token = conf.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
    repository_path = conf.REPOSITORY_PATH || process.env.REPOSITORY_PATH,
    result_output_path = conf.RESULT_OUTPUT_PATH || process.env.RESULT_OUTPUT_PATH,
    monitor_interval = conf.MONITOR_INTERVAL || process.env.MONITOR_INTERVAL;

var app = express();
app.use(express.bodyParser());

/**
 * Interval to hit the test interface to kick off a test.
 *
 */
var intervalRunTests;
intervalRunTests = setInterval(function(){
    shell.exec('curl -s -X POST http://localhost:'+PORT+'/executeMonitorFrisby > /dev/null', function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
    });
}, monitor_interval);


/**
 *  -Pull new code into the local servers directory
 *  -Output userData to disk
 *
 *  -input: github_url, oauth_token, user_id, username, email
 */
function pullCode(){

    repository.setGithubURL(github_url);
    repository.setOauthToken(github_token);
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
                   if(err !== true){
                       console.log(results);
                       callback(null, results);
                   }else{
                       // Error
                       console.log(results);
                       callback(null, false);
                   }
                });
            }
        ],
        // optional callback
        function(err, results){
            console.log('Final test output:');
            console.log(results[3].body);

            // Handle the frisby.js test results
            resultHandler.setXmlResults(results[3].body);
            resultHandler.parse();
            resultHandler.triggers();
    });
});

app.get('/heartbeat', function(req, res) {
    res.json(200, { message: 'Alive'});
})

//
// Create HTTP server
//
server = http.createServer(app);

server.listen(PORT, HOST, null, function() {
    console.log('Server listening on port %d in %s mode', PORT, app.settings.env);
});


// Run pull code on startup
pullCode();