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

// Setup thresholds
var threshold_errors = process.env.THRESHOLD_ERRORS || conf.THRESHOLD_ERRORS;
var threshold_failures = process.env.THRESHOLD_FAILURES || conf.THRESHOLD_FAILURES;

// Setup trigger action
var action_email = process.env.TRIGGER_EMAIL || conf.TRIGGER_EMAIL || false;
var action_webhook = process.env.TRIGGER_WEBHOOK || conf.TRIGGER_WEBHOOK || false;
var action_pagerDuty = process.env.TRIGGER_PAGER_DUTY || conf.TRIGGER_PAGER_DUTY || false;
var action_hipchat = process.env.TRIGGER_HIPCHAT || conf.TRIGGER_HIPCHAT || false;

// Setup action email params
var action_email_protocol = process.env.ACTION_EMAIL_PROTOCOL || conf.ACTION_EMAIL_PROTOCOL;
var action_email_host = process.env.ACTION_EMAIL_HOST || conf.ACTION_EMAIL_HOST;
var action_email_endpoint = process.env.ACTION_EMAIL_ENDPOINT || conf.ACTION_EMAIL_ENDPOINT;
var action_email_http_method = process.env.ACTION_EMAIL_HTTP_METHOD || conf.ACTION_EMAIL_HTTP_METHOD;
var action_email_from = process.env.ACTION_EMAIL_FROM || conf.ACTION_EMAIL_FROM;
var action_email_to = process.env.ACTION_EMAIL_TO || conf.ACTION_EMAIL_TO;
var action_email_subject = process.env.ACTION_EMAIL_SUBJECT || conf.ACTION_EMAIL_SUBJECT;

// Setup action webhook
var action_webhook_prototol = process.env.ACTION_WEBHOOK_PROTOCOL || conf.ACTION_WEBHOOK_PROTOCOL;
var action_webhook_method = process.env.ACTION_WEBHOOK_METHOD || conf.ACTION_WEBHOOK_METHOD;
var action_webhook_host = process.env.ACTION_WEBHOOK_HOST || conf.ACTION_WEBHOOK_HOST;
var action_webhook_endpoint = process.env.ACTION_WEBHOOK_ENDPOINT || conf.ACTION_WEBHOOK_ENDPOINT;

// Setup action PagerDuty
var action_pagerduty_protocol = process.env.ACTION_PAGERDUTY_PROTOCOL || conf.ACTION_PAGERDUTY_PROTOCOL;
var action_pagerduty_host = process.env.ACTION_PAGERDUTY_HOST || conf.ACTION_PAGERDUTY_HOST;
var action_pagerduty_endpoint = process.env.ACTION_PAGERDUTY_ENDPOINT || conf.ACTION_PAGERDUTY_ENDPOINT;
var action_pagerduty_method = process.env.ACTION_PAGERDUTY_METHOD || conf.ACTION_PAGERDUTY_METHOD;
var action_pagerduty_service_key = process.env.ACTION_PAGERDUTY_SERVICE_KEY || conf.ACTION_PAGERDUTY_SERVICE_KEY;
var action_pagerduty_incident_key = process.env.ACTION_PAGERDUTY_INCIDENT_KEY || conf.ACTION_PAGERDUTY_INCIDENT_KEY;
var action_pagerduty_event_type = process.env.ACTION_PAGERDUTY_EVENT_TYPE || conf.ACTION_PAGERDUTY_EVENT_TYPE;
var action_pagerduty_description = process.env.ACTION_PAGERDUTY_DESCRIPTION || conf.ACTION_PAGERDUTY_DESCRIPTION;
var action_pagerduty_client = process.env.ACTION_PAGERDUTY_CLIENT || conf.ACTION_PAGERDUTY_CLIENT;
var action_pagerduty_client_url = process.env.ACTION_PAGERDUTY_CLIENT_URL || conf.ACTION_PAGERDUTY_CLIENT_URL;

// Setup action HipChat
var action_hipchat_protocol = process.env.ACTION_HIPCHAT_PROTOCOL || conf.ACTION_HIPCHAT_PROTOCOL;
var action_hipchat_host = process.env.ACTION_HIPCHAT_HOST || conf.ACTION_HIPCHAT_HOST;
var action_hipchat_endpoint = process.env.ACTION_HIPCHAT_ENDPOINT || conf.ACTION_HIPCHAT_ENDPOINT;
var action_hipchat_method = process.env.ACTION_HIPCHAT_METHOD || conf.ACTION_HIPCHAT_METHOD;
var action_hipchat_authtoken = process.env.ACTION_HIPCHAT_AUTHTOKEN || conf.ACTION_HIPCHAT_AUTHTOKEN;
var action_hipchat_msg_color = process.env.ACTION_HIPCHAT_MSG_COLOR || conf.ACTION_HIPCHAT_MSG_COLOR;
var action_hipchat_msg_notify = process.env.ACTION_HIPCHAT_MSG_NOTIFY || conf.ACTION_HIPCHAT_MSG_NOTIFY;
var action_hipchat_msg_format = process.env.ACTION_HIPCHAT_MSG_FORMAT || conf.ACTION_HIPCHAT_MSG_FORMAT;

// Results objects
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

    console.log(JSON.stringify(results_json));
    console.log('Test name: '+ this.getTestName());
    console.log('Test errors: '+this.getTotalErrors());
    console.log('Test failures: '+this.getTotalFailures());
    console.log('Test time: '+this.getTestDuration());

    if(trigger_on_all){
        console.log('Trigger on all...');

        emailTrigger();
        webhookTrigger();
        pagerDutyTrigger();
        hipchatTrigger();
    }
    if(this.getTotalErrors() >= threshold_errors){
        if(trigger_on_error){
            console.log('Trigger on error...');

            emailTrigger();
            webhookTrigger();
            pagerDutyTrigger();
            hipchatTrigger();
        }
    }
    if(this.getTotalFailures() >= threshold_failures){
        if(trigger_on_failures){
            console.log('Trigger on failures...');

            emailTrigger();
            webhookTrigger();
            pagerDutyTrigger();
            hipchatTrigger();
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
 * Handles webhook trigger
 *
 * Sends the entire test payload in the body of the http webhook request
 */
function webhookTrigger(){
    if(action_webhook){
        console.log('webhook trigger');

        var dataString = JSON.stringify(results_json); // '{"something":2}';

        var contentType = 'application/json';

        triggerEmail.httpSend(action_webhook_prototol, action_webhook_host, action_webhook_endpoint, action_webhook_method, contentType, dataString);
    }
}
/**
 * Handle Pager Duty trigger
 *
 * documentation: http://developer.pagerduty.com/documentation/integration/events/trigger
 */
function pagerDutyTrigger(){
    if(action_pagerDuty){
        console.log('pager duty trigger');

        var pagerDutyObj = {
            service_key: action_pagerduty_service_key,
            incident_key: action_pagerduty_incident_key,
            event_type: action_pagerduty_event_type,
            description: action_pagerduty_description,
            client: action_pagerduty_client,
            client_url: action_pagerduty_client_url,
            details: results_json
        };

        var contentType = 'application/json';

        var dataString = JSON.stringify(pagerDutyObj);

        triggerEmail.httpSend(action_pagerduty_protocol, action_pagerduty_host, action_pagerduty_endpoint, action_pagerduty_method, contentType, dataString);
    }
}

/**
 * Handle HipChat trigger
 *
 * documentation: https://www.hipchat.com/docs/apiv2/method/send_room_notification
 */
function hipchatTrigger(){
    if(action_hipchat) {
        console.log('hipchat trigger');

        var hipchatObj = {
            color: action_hipchat_msg_color,
            message: results_json,
            notify: action_hipchat_msg_notify,
            message_format: action_hipchat_msg_format
        };
        var contentType = 'application/json';

        var dataString = JSON.stringify(hipchatObj);

        var endpoint_with_authtoken = action_hipchat_endpoint + '?auth_token=' + action_hipchat_authtoken;

        triggerEmail.httpSend(action_hipchat_protocol, action_hipchat_host, endpoint_with_authtoken, action_hipchat_method, contentType, dataString);
    }
}