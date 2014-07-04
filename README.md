API-Monitor-Runner
==================

[![Build Status](https://drone.io/github.com/AutoDevBot/API-Monitor-Runner/status.png)](https://drone.io/github.com/AutoDevBot/API-Monitor-Runner/latest)

Runs REST API monitoring tests on an interval and notifies you when there are error.  The REST API monitors are defined with [frisby.js](http://frisbyjs.com/).  Frisby.js is very robust and flexible that is designed to specifically test REST API with an easy syntax. 

Getting started
------------

API-Monitor-Runner is a node.js application but it can test any REST API application.

First clone out this repository:

    git clone https://github.com/AutoDevBot/API-Monitor-Runner.git
    
Install this applications npm modules.  Change directory into this repo and run:

    npm install

Run the application:

    node app.js

Docker Container
---------------
Another easy way to run this is with Docker.io.  This is a pre-built container containing the latest code from this project ready to go.  You can find the project here:

    https://registry.hub.docker.com/u/garland/api-monitor-runner
    
Any of the parameters in the config.js.sample file can be passed into the application via the docker env parameters on start.

One easy way to try this docker container without having to setup a Docker server is to run it on a Docker.io container hosting service such as [Tutum](https://www.tutum.co).

With Docker containers, you only need to pass in the environment params that you want to change from the default config.js file.

#### Example docker run command

    docker run \
    --env GITHUB_URL=https://github.com/AutoDevBot/API-Monitor-Runner.git \
    --env GITHUB_TOKEN=my_auth_token \
    garland/api-monitor-runner

Config.js File
--------------
The config.js file controls how the application behaves.  There is a default config.js file at the root of this application.  These settings can be set in the file or via the system environment variables.  If a parameter is set via the environment variable it will override what is in the config.js file.

#### Github.com params
 * `GITHUB_URL`=> An http URL to a Github repository holding API monitoring tests you want this application to run.
 * `GITHUB_TOKEN` => This token allows you to access your private github.com repos with an application key.  Generate an github access token to clone a private repo: https://help.github.com/articles/creating-an-access-token-for-command-line-use

#### API Monitor Operations
 * `REPOSITORY_PATH` => Local directory to clone the repository to
 * `RESULT_OUTPUT_PATH` => Local directory to put the results

#### API Monitoring run interval
 * `MONITOR_INTERVAL` => Sets how often to run the monitoring tests.  This value is in milliseconds

#### Server params
 * `SERVER_PORT` => local application server's port
 * `SERVER_HOST` => IP to bind server to

#### Test result to trigger on
 * `TRIGGER_ON_ALL` => true|false - If set to true, every monitor that runs is triggered and the "trigger actions" will take effect even for successfull monitors runs
 * `TRIGGER_ON_ERROR` => true|false - only trigger if there are monitor errors
 * `TRIGGER_ON_FAILURES` => true|false - only trigger if there are monitor failures

#### Trigger action
 * `TRIGGER_EMAIL` => true|false - enable email notification.  Configuration below
 * `TRIGGER_PAGER_DUTY` => true|false - enable PagerDuty notification.  Configuration below
 * `TRIGGER_WEBHOOK` => true|false - enable a generic webhook notification.  Configuration below
 * `TRIGGER_HIPCHAT` => true|false - enable HipChat notification.  Configuration below
 
#### Error thresholds
 * `THRESHOLD_ERRORS` => int - set to 0 or more
 * `THRESHOLD_FAILURES` => int - set to 0 or more
 
#### Action config - Webhook
 * `ACTION_WEBHOOK_PROTOCOL` => http|https
 * `ACTION_WEBHOOK_METHOD` => GET|POST|PUT
 * `ACTION_WEBHOOK_HOST` => fully qualified hostname: example.com
 * `ACTION_WEBHOOK_ENDPOINT` => REST endpoint to call.  Example: /notification
 
#### Action config - email to emailer server - https://github.com/AutoDevBot/Email-Notification
 * `ACTION_EMAIL_PROTOCOL` => http|https
 * `ACTION_EMAIL_HOST` => GET|POST|PUT
 * `ACTION_EMAIL_ENDPOINT` => /email - this is fixed for this server
 * `ACTION_EMAIL_HTTP_METHOD` => http
 * `ACTION_EMAIL_FROM` => From email address
 * `ACTION_EMAIL_TO` => To email address
 * `ACTION_EMAIL_SUBJECT` => Subject line in email
 
#### Action config - PagerDuty

Documentation for the PagerDuty values are [here](http://developer.pagerduty.com/documentation/integration/events/trigger)

 * `ACTION_PAGERDUTY_PROTOCOL` => https
 * `ACTION_PAGERDUTY_HOST` => events.pagerduty.com - this is fixed for the PagerDuty API host
 * `ACTION_PAGERDUTY_METHOD` => POST - this is fixed for this action's method
 * `ACTION_PAGERDUTY_ENDPOINT` => /generic/2010-04-15/create_event.json - this is fixed for this action's endpoint
 * `ACTION_PAGERDUTY_SERVICE_KEY` => see PagerDuty's documentation
 * `ACTION_PAGERDUTY_INCIDENT_KEY` => see PagerDuty's documentation
 * `ACTION_PAGERDUTY_EVENT_TYPE` => see PagerDuty's documentation
 * `ACTION_PAGERDUTY_DESCRIPTION` => see PagerDuty's documentation
 * `ACTION_PAGERDUTY_CLIENT` => see PagerDuty's documentation
 * `ACTION_PAGERDUTY_CLIENT_URL` => see PagerDuty's documentation
 
#### Action config - HipChat

documentation for the HipChat values are [here](https://www.hipchat.com/docs/apiv2/method/send_room_notification)

 * `ACTION_HIPCHAT_PROTOCOL` => https
 * `ACTION_HIPCHAT_HOST` => api.hipchat.com - this is fixed for the HipChat API
 * `ACTION_HIPCHAT_METHOD` => POST - this is fixed for the HipChat API
 * `ACTION_HIPCHAT_ENDPOINT` => /v2/room/{id_or_name}/notification - you will need to replace {id_or_name} with the room you want the notification to goto
 * `ACTION_HIPCHAT_AUTHTOKEN` => authentication token for your HipChat account.  See HipChat documentation on how to get this.
 * `ACTION_HIPCHAT_MSG_COLOR` => see HipChat documenation
 * `ACTION_HIPCHAT_MSG_NOTIFY` => see HipChat documenation
 * `ACTION_HIPCHAT_MSG_FORMAT` => see HipChat documenation
