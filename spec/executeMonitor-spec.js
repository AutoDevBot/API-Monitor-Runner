var executeMonitor = require('../lib/ExecuteMonitor.js');

describe("Execute a Frisby.js test", function(){

    it("Should check if the repository exist", function(done){

        executeMonitor.setRepoPath('/opt/repo');
        executeMonitor.doesExecuteRepoExist(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);
            done();
        });

        executeMonitor.setRepoPath('/opt/foobar-zzzzzz');
        executeMonitor.doesExecuteRepoExist(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(false);
            done();
        });

    });


    it("Should remove old test results", function(done){

        executeMonitor.setResultOutputDir('/tmp/frisby_output/');
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

        executeMonitor.setRepoPath('/opt/repo');
        executeMonitor.setResultOutputDir('/tmp/frisby_output/');
        executeMonitor.runFrisbyjsTests(function(err, result){
            expect(result).toBe(true);
            done();
        });
    });

    it('Should retrieve the Frisby.js results from the file system', function(done){

        executeMonitor.setResultOutputDir('/tmp/frisby_output/');
        executeMonitor.getResults(function(err, results){
            expect(err).toBe(null);
            expect(results).not.toBe(null);
            done();
        });

    });
});