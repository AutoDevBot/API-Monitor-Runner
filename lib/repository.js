var shell = require('shelljs');

var repoPath = null;
var oauth_token = null;
var github_url = null;

exports.setRepoPath = function(value){
    repoPath = value;
};
exports.setOauthToken = function(value){
    oauth_token = value;
};
exports.setGithubURL = function(value){
    github_url = value;
}

/**
 * Puts the OAuth Token inside the GitHub url for authentication
 *
 * https://github.com/blog/1270-easier-builds-and-deployments-using-git-over-https-and-oauth
 *
 * returns: https://<token>@github.com/owner/repo.git
 *
 * @param oAuthToken
 * @param gitHubURL
 * @returns url
 */
exports.insertOauthTokenInGithubURL = function(oAuthToken, gitHubURL){

    var returnString = gitHubURL.replace(/^https:\/\//, "");
    return 'https://'+oAuthToken+'@'+returnString;
};

/**
 * Removes the repository directory
 *
 * @param callback
 */
exports.remove = function(callback){

    shell.exec('rm -rf '+repoPath, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);

        if(code === 0){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });
};

/**
 * Clones a repository
 */
exports.clone = function(callback){

    var gitHubURLWithOauthToken = this.insertOauthTokenInGithubURL(oauth_token, github_url);

    console.log('GitHub URL: '+gitHubURLWithOauthToken);
    shell.exec('git clone '+gitHubURLWithOauthToken+' '+repoPath, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);

        if(code === 0){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });
};

exports.runNPMInstall = function(callback){

    // Run npm install in the user's repository
    console.log('Running npm install in the users repository');
    cmd_npm_install = 'cd '+repoPath+' && npm install';
    shell.exec(cmd_npm_install, function(code, output){
        console.log('Exit code:', code);
        console.log('Program output:', output);

        if(code === 0){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });
};