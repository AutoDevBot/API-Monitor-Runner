/**
 * Handles results
 */

var conf = require('../config.js');
var parseString = require('xml2js').parseString;
var triggerEmail = require('./triggerEmail.js');

// Setup test result triggers
var trigger_on_all = process.env.TRIGGER_ON_ALL || conf.TRIGGER_ON_ALL;
var trigger_on_error = process.env.TRIGGER_ON_ERROR || conf.TRIGGER_ON_ERROR;
var trigger_on_failures = process.env.TRIGGER_ON_FAILURES || conf.TRIGGER_ON_FAILURES;

// Setup trigger action
var action_email = process.env.TRIGGER_EMAIL || conf.TRIGGER_EMAIL;
var action_pagerDuty = process.env.TRIGGER_PAGER_DUTY || conf.TRIGGER_PAGER_DUTY;

// Setup action email params
var action_email_protocol = process.env.ACTION_EMAIL_PROTOCOL || conf.ACTION_EMAIL_PROTOCOL;
var action_email_host = process.env.ACTION_EMAIL_HOST || conf.ACTION_EMAIL_HOST;
var action_email_endpoint = process.env.ACTION_EMAIL_ENDPOINT || conf.ACTION_EMAIL_ENDPOINT;
var action_email_http_method = process.env.ACTION_EMAIL_HTTP_METHOD || conf.ACTION_EMAIL_HTTP_METHOD;
var action_email_from = process.env.ACTION_EMAIL_FROM || conf.ACTION_EMAIL_FROM;
var action_email_to = process.env.ACTION_EMAIL_TO || conf.ACTION_EMAIL_TO;
var action_email_subject = process.env.ACTION_EMAIL_SUBJECT || conf.ACTION_EMAIL_SUBJECT;


var results_xml = null;
var results_json = null;

/**
 * Set the xml string
 *
 * @param string
 */
exports.setXmlResults = function(string){
    results_xml = string;
};

/**
 * Converts xml to json
 *
 * @param xml_string
 * @param callback
 */
exports.parse = function(){

    // Parse xml to JSON
    parseString(results_xml, function (err, result) {
        if(err){
            console.log('Error parsing xml');
        }else {
            results_json = result;
        }
    });
};

exports.getTestName = function(){
    return results_json.testsuites.testsuite[0].$.name;
};
exports.getTotalErrors = function(){
    return results_json.testsuites.testsuite[0].$.errors;
};
exports.getTotalFailures = function(){
    return results_json.testsuites.testsuite[0].$.failures;
};
exports.getTestDuration = function(){
    return results_json.testsuites.testsuite[0].$.time;
};

/**
 * Handle triggers on the test results
 *
 */
exports.triggers = function(){

    console.log('Test name: '+ this.getTestName());
    console.log('Test errors: '+this.getTotalErrors());
    console.log('Test failures: '+this.getTotalFailures());
    console.log('Test time: '+this.getTestDuration());

    if(trigger_on_all){
        console.log('Trigger on all...');

        emailTrigger();
        pagerDutyTrigger();
    }
    if(this.getTotalErrors() > 0){
        if(trigger_on_error){
            console.log('Trigger on error...');

            emailTrigger();
            pagerDutyTrigger();
        }
    }
    if(this.getTotalFailures() > 0){
        if(trigger_on_failures){
            console.log('Trigger on failures...');

            emailTrigger();
            pagerDutyTrigger();
        }
    }
};

/**
 * Handle email trigger
 */
function emailTrigger(){
    if(action_email){
        console.log('email trigger');

        // send email
        var subject = action_email_subject + '';
        var body = '';
        triggerEmail.send(action_email_protocol, action_email_host, action_email_endpoint, action_email_http_method, action_email_from, action_email_to, subject, body);
    }
}
/**
 * Handle Pager Duty trigger
 */
function pagerDutyTrigger(){
    if(action_pagerDuty){
        console.log('pager duty trigger');

        // send to pager duty
    }
}