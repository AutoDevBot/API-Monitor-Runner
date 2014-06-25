API-Monitor-Runner
==================

[![Build Status](https://drone.io/github.com/AutoDevBot/API-Monitor-Runner/status.png)](https://drone.io/github.com/AutoDevBot/API-Monitor-Runner/latest)

Starts a server that periodically and on-demand runs a suite of Frisby.js tests against your APIs.  In the event of an error, an email is sent (coming soon).

Getting started
---------------
1.  Install the package dependencies.  From the project root, run `npm install`.
2.  Verify the setup by running the tests, run `jasmine-node spec/*`.
3.  Start the server, run `node app.js`.

Docker Container
---------------
There is a Dockerfile to build this repo and it is also in the Docker Hub

https://registry.hub.docker.com/u/garland/api-monitor-runner/