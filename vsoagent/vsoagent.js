// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
/// <reference path="./definitions/node.d.ts"/>
var childProcess = require("child_process");
var cfgm = require("./configuration");
var ctxm = require('./context');
var listener = require('./api/messagelistener');
var path = require('path');
var cm = require('./common');
var tm = require('./tracing');
var webapi = require('./api/webapi');
var heartbeat = require('./heartbeat');
var inDebugger = (typeof global.v8debug === 'object');
var supported = ['darwin', 'linux'];
if (supported.indexOf(process.platform) == -1) {
    console.error('Unsupported platform: ' + process.platform);
    console.error('Supported platforms are: ' + supported.toString());
    process.exit(1);
}




var ag;
var trace;
var cfgr = new cfgm.Configurator();
var messageListener;
var runWorker = function (ag, workerMsg) {
    var worker = childProcess.fork(path.join(__dirname, 'vsoworker'), [], {
        env: process.env,
        execArgv: []
    });
    // worker ipc callbacks
    worker.on('message', function (msg) {
        try {
            if (msg.messageType === 'log') {
            }
            else if (msg.messageType === 'status') {
            }
        }
        catch (err) {
            ag.error("host" + err);
        }
    });
    ag.verbose('host::workerSend');
    worker.send(workerMsg);
};
var INIT_RETRY_DELAY = 15000;
var ensureInitialized = function (settings, creds, complete) {
    cfgr.readConfiguration(creds, settings)
        .then(function (config) {
        complete(null, config);
    })
        .fail(function (err) {
        console.error(err.message);
        // exit if the pool or agent does not exist anymore
        if (err.errorCode === cm.AgentError.PoolNotExist ||
            err.errorCode === cm.AgentError.AgentNotExist) {
            console.error('Exiting.');
            return;
        }
        // also exit if the creds are now invalid
        if (err.statusCode && err.statusCode == 401) {
            console.error('Invalid credentials.  Exiting.');
            return;
        }
        console.error('Could not initialize.  Retrying in ' + INIT_RETRY_DELAY / 1000 + ' sec');
        setTimeout(function () {
            ensureInitialized(settings, creds, complete);
        }, INIT_RETRY_DELAY);
    });
};
var _creds;
cm.readBasicCreds()
    .then(function (credentials) {
    _creds = credentials;
    return cfgr.ensureConfigured(credentials);
})
    .then(function (config) {
    var settings = config.settings;
    if (!settings) {
        throw (new Error('Settings not configured.'));
    }
    var agent = config.agent;
    ag = new ctxm.AgentContext(config, true);
    trace = new tm.Tracing(__filename, ag);
    trace.callback('initAgent');
    ag.status('Agent Started.');
    var queueName = agent.name;
    ag.info('Listening for agent: ' + queueName);
    var agentApi = webapi.AgentApi(settings.serverUrl, cm.basicHandlerFromCreds(_creds));
    messageListener = new listener.MessageListener(agentApi, agent, config.poolId);
    trace.write('created message listener');
    ag.info('starting listener...');
    heartbeat.write();
    messageListener.on('listening', function () {
        heartbeat.write();
    });
    messageListener.on('info', function (message) {
        ag.info('messenger: ' + message);
    });
    messageListener.on('sessionUnavailable', function () {
        ag.error('Could not create a session with the server.');
        gracefulShutdown(0);
    });
    messageListener.start(function (message) {
        trace.callback('listener.start');
        ag.info('Message received');
        ag.info('Message Type: ' + message.messageType);
        trace.state('message', message);
        var messageBody = null;
        try {
            messageBody = JSON.parse(message.body);
        }
        catch (e) {
            ag.error(e);
            return;
        }
        ag.verbose(JSON.stringify(messageBody, null, 2));
        if (message.messageType === 'JobRequest') {
            var workerMsg = {
                messageType: "job",
                config: config,
                data: messageBody
            };
            runWorker(ag, workerMsg);
        }
        else {
            ag.error('Unknown Message Type: ' + message.messageType);
        }
    }, function (err) {
        if (!err || !err.hasOwnProperty('message')) {
            ag.error("Unknown error occurred while connecting to the message queue.");
        }
        else {
            ag.error('Message Queue Error:');
            ag.error(err.message);
        }
    });
})
    .fail(function (err) {
    console.error('Error starting the agent');
    console.error(err.message);
    if (ag) {
        ag.error(err.stack);
    }
    gracefulShutdown(0);
});
process.on('uncaughtException', function (err) {
    if (ag) {
        ag.error('agent unhandled:');
        ag.error(err.stack);
    }
    else {
        console.error(err.stack);
    }
});
//
// TODO: re-evaluate and match .net agent exit codes
// 0: agent will go down and host will not attempt restart
// 1: agent will attempt
//
var gracefulShutdown = function (code) {
    console.log("\nShutting down host.");
    if (messageListener) {
        messageListener.stop(function (err) {
            if (err) {
                ag.error('Error deleting agent session:');
                ag.error(err.message);
            }
            heartbeat.stop();
            process.exit(code);
        });
    }
    else {
        heartbeat.stop();
        process.exit(code);
    }
};
process.on('SIGINT', function () {
    gracefulShutdown(0);
});
process.on('SIGTERM', function () {
    gracefulShutdown(0);
});

