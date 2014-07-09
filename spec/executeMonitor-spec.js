var executeMonitor = require('../lib/ExecuteMonitor.js');
var shell = require('shelljs');

describe("Execute a Frisby.js test", function(){

    var repo_path = '/tmp/repo';
    var result_output_path = '/tmp/frisby_output/';

    beforeEach(function(done) {

        // Download repository and run npm install in it
        var url = 'https://github.com/AutoDevBot/monitor-examples.git';
        shell.exec('git clone '+url+' '+repo_path+' && cd '+repo_path+' && npm install', function(code, output) {
            console.log('Exit code:', code);
            console.log('Program output:', output);
            done();
        });
    });

    afterEach(function(done) {

        // Remove the repository
        shell.exec('rm -rf '+repo_path, function(code, output) {
            console.log('Exit code:', code);
            console.log('Program output:', output);
            done();
        });
    });

    it("Should check if the repository exist", function(done){

        executeMonitor.setRepoPath(repo_path);
        executeMonitor.doesExecuteRepoExist(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);
            done();
        });

        executeMonitor.setRepoPath('/tmp/foobar-zzzzzz');
        executeMonitor.doesExecuteRepoExist(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(false);
            done();
        });

    });

    it("Should remove old test results", function(done){

        executeMonitor.setResultOutputDir(result_output_path);
        executeMonitor.removePreviousTestResults(function(err, result){
            expect(result).toBe(true);
            done();
        });

        executeMonitor.setResultOutputDir('/tmp/foobar-zzzzzz/');
        executeMonitor.removePreviousTestResults(function(err, result){
            expect(result).toBe(true);
            done();
        });
    });

    it('Should execute the Frisby.js tests', function(done){

        executeMonitor.setRepoPath(repo_path);
        executeMonitor.setResultOutputDir(result_output_path);
        executeMonitor.runFrisbyjsTests(function(err, result){
            expect(result).toBe(true);
            done();
        });
    });

    it('Should retrieve the Frisby.js results from the file system', function(done){

        executeMonitor.setResultOutputDir(result_output_path);
        executeMonitor.getResults(function(err, results){
            expect(err).toBe(null);
            expect(results).not.toBe(null);
            done();
        });
    }, 10000);
});