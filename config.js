// Test results to trigger on
exports.TRIGGER_ON_ALL = false;
exports.TRIGGER_ON_ERROR = true;
exports.TRIGGER_ON_FAILURES = true;

// Trigger action
exports.TRIGGER_EMAIL = true;
exports.TRIGGER_PAGER_DUTY = true;
exports.TRIGGER_WEBHOOK = true;
exports.TRIGGER_HIPCHAT = true;

// Error Thresholds
exports.THRESHOLD_ERRORS = 0;
exports.THRESHOLD_FAILURES = 1;

// Action config - Webhook
exports.ACTION_WEBHOOK_PROTOCOL = 'https';
exports.ACTION_WEBHOOK_METHOD = 'POST';
exports.ACTION_WEBHOOK_HOST = '6515ecf2-100a681ba7e4.my.apitools.com';
exports.ACTION_WEBHOOK_ENDPOINT = '/webhook';

// Action config - email to emailer server
//
// documentation: https://github.com/AutoDevBot/Email-Notification
//
exports.ACTION_EMAIL_PROTOCOL = 'https';
exports.ACTION_EMAIL_HOST = '6515ecf2-100a681ba7e4.my.apitools.com';
exports.ACTION_EMAIL_ENDPOINT = '/email';
exports.ACTION_EMAIL_HTTP_METHOD = 'POST';
exports.ACTION_EMAIL_FROM = 'joe@example.com';
exports.ACTION_EMAIL_TO = 'destination@example.com';
exports.ACTION_EMAIL_SUBJECT = 'Frisby.js Test - ';

// Action config - PagerDuty
//
// documentation: http://developer.pagerduty.com/documentation/integration/events/trigger
//
exports.ACTION_PAGERDUTY_PROTOCOL = 'https';
exports.ACTION_PAGERDUTY_HOST = '6515ecf2-100a681ba7e4.my.apitools.com'; //'events.pagerduty.com';
exports.ACTION_PAGERDUTY_METHOD = 'POST';
exports.ACTION_PAGERDUTY_ENDPOINT = '/generic/2010-04-15/create_event.json';
exports.ACTION_PAGERDUTY_SERVICE_KEY = 'e93facc04764012d7bfb002500d5d1a6';
exports.ACTION_PAGERDUTY_INCIDENT_KEY = 'srv01/HTTP';
exports.ACTION_PAGERDUTY_EVENT_TYPE = 'trigger';
exports.ACTION_PAGERDUTY_DESCRIPTION = 'FAILURE for API Monitoring';
exports.ACTION_PAGERDUTY_CLIENT = 'Sample Monitoring Service';
exports.ACTION_PAGERDUTY_CLIENT_URL = 'https://monitoring.service.com';

// Action config - HipChat
//
// documentation: https://www.hipchat.com/docs/apiv2/method/send_room_notification
//
exports.ACTION_HIPCHAT_PROTOCOL = 'https';
exports.ACTION_HIPCHAT_HOST = '6515ecf2-100a681ba7e4.my.apitools.com'; //'api.hipchat.com';
exports.ACTION_HIPCHAT_METHOD = 'POST';
exports.ACTION_HIPCHAT_ENDPOINT = '/v2/room/{id_or_name}/notification';  // Replace {id_or_name} with your room name
exports.ACTION_HIPCHAT_AUTHTOKEN = 'abc123';
exports.ACTION_HIPCHAT_MSG_COLOR = 'yellow';
exports.ACTION_HIPCHAT_MSG_NOTIFY = 'false';
exports.ACTION_HIPCHAT_MSG_FORMAT = 'html';
