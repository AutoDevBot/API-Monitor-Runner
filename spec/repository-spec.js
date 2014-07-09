var shell = require('shelljs');
var repository = require('../lib/repository.js');

var repo_path = '/tmp/repo';

describe("Before pulling a repository", function(){

    beforeEach(function(done) {

        // Create dummy directory for repository.remove() to remove
        shell.exec('mkdir '+repo_path+'; echo 0', function(code, output) {
            console.log('Exit code:', code);
            console.log('Program output:', output);
            done();
        });
    });
    afterEach(function(done) {
        // remove dummy directory
        shell.exec('rmdir '+repo_path+'; echo 0', function(code, output) {
            console.log('Exit code:', code);
            console.log('Program output:', output);
            done();
        });
    });

    it("Should insert the Github Oauth token into the Github URL", function(done){
        oAuthToken = '1234';
        gitHubURL = 'https://github.com/caolan/async#seriestasks-callback';
        var newURL = repository.insertOauthTokenInGithubURL(oAuthToken, gitHubURL);
        expect(newURL).toBe('https://1234@github.com/caolan/async#seriestasks-callback');
        done();
    });

    it("Should be able to remove the current repository", function(done){
        repository.setRepoPath(repo_path);
        repository.remove(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);
            done();
        });
    });
});

describe("Dealing with pulling Github repository", function(){

    it("Should clone a Github.com respository", function(done){
        repository.setRepoPath(repo_path);
        repository.setOauthToken('1234');
        repository.setGithubURL('https://github.com/AutoDevBot/14e5c618a5ff4fe3a5597d2f51163df3.git');
        repository.clone(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);
            done();
        });
    });

    it("Should run npm install in the users repository", function(done){
        repository.setRepoPath(repo_path);
        repository.runNPMInstall(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);

            // remove repo directory after this test is done
            shell.exec('rm -rf '+repo_path, function(code, output) {
                console.log('Exit code:', code);
                console.log('Program output:', output);
                done();
            });

            done();
        });
    }, 10000);


});