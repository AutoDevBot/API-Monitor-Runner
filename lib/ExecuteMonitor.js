var shell = require('shelljs');

var repo_path = '';
var result_output_dir = '';
var frisby_path = 'not_used';

exports.setRepoPath = function(value){
    repo_path = value;
};

exports.setResultOutputDir = function(value){
    result_output_dir = value;
};

exports.doesExecuteRepoExist = function(callback){

    if (shell.test('-d', repo_path)){
        callback(null, true);
    }else{
        callback(null, false);
    }
};

exports.removePreviousTestResults = function(callback){

    var command = 'rm '+result_output_dir+'* || true';
    //var command = 'rm '+result_output_dir+'*';

    shell.exec(command, function(code, output) {
        console.log('Exit code:', code);
        //console.log('Program output:', output);

        if(code === 0){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });

};
exports.runFrisbyjsTests = function(callback){

    var command = 'jasmine-node  --junitreport --output '+result_output_dir+' --config FRISBY_PATH '+frisby_path+' '+repo_path;

    shell.exec(command, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);

        if(code === 0){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });
};

exports.getResults = function(callback){

    // List output directory and process results files
    var result_file_list = shell.ls(result_output_dir);
    console.log(result_file_list);

    // For each file cat it out
    result_file_list.forEach(function(item){
        console.log(item);

        if(shell.test('-e', result_output_dir+item)){
            var str = shell.cat(result_output_dir+item);

            // send that info into the queue
            var queueObject = new Object();
            queueObject.body = str;
            //queueObject.fields = userData; //JSON.stringify(userData); //'{"user_id":"'+userData.user_id+'", "username":"'+userData.username+'","reponame":"'+userData.github_url+'"}';

            console.log('info', 'queueObject...');
            console.log(queueObject);

            // POST message to the queue
            //console.log('pushing message to queue: '+mq_raw_monitoring_results);
            //MQ.queuesPOST(mq_raw_monitoring_results, queueObject);

            callback(null, queueObject);

        }else{
            console.log('File does not exist: '+result_output_dir+item);
            callback(true, 'File does not exist: '+result_output_dir+item);
        }

    });

};