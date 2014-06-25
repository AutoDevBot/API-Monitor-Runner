// Test results to trigger on
exports.TRIGGER_ON_ALL = true;
exports.TRIGGER_ON_ERROR = true;
exports.TRIGGER_ON_FAILURES = true;

// Trigger action
exports.TRIGGER_EMAIL = true;
exports.TRIGGER_PAGER_DUTY = true;

// Action config - email
exports.ACTION_EMAIL_PROTOCOL = 'http';
exports.ACTION_EMAIL_HOST = 'localhost';
exports.ACTION_EMAIL_ENDPOINT = '/email';
exports.ACTION_EMAIL_HTTP_METHOD = 'POST';
exports.ACTION_EMAIL_FROM = 'joe@example.com';
exports.ACTION_EMAIL_TO = 'destination@example.com';
exports.ACTION_EMAIL_SUBJECT = 'Frisby.js Test - ';
