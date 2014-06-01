var repository = require('../lib/repository.js');

describe("Deal with pulling Github repository", function(){

    var repo_path = '/tmp/repo'; //'/opt/repo'

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

    it("Should clone a Github.com respository", function(done){
        repository.setRepoPath(repo_path);
        repository.setOauthToken('1234');
        repository.setGithubURL('https://github.com/AutoDevBot/14e5c618a5ff4fe3a5597d2f51163df3.git');
        repository.clone(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);
            done();
        });
    })

    it("Should run npm install in the users repository", function(done){
        repository.setRepoPath(repo_path);
        repository.runNPMInstall(function(err, result){
            expect(err).toBe(null);
            expect(result).toBe(true);
            done();
        });
    }, 10000);
});