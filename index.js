var helpers = require('./helpers');
var schedule = require('node-schedule');
var config = require('./config');
var PushBullet = require('pushbullet');
var pusher = new PushBullet(config.pushbullet_key);
var _ = require('lodash');
var fs = require('fs');

function sendPush(item) {
    pusher.link('', 'New EP of ' + item.name + ' is up!', item.link);
}

function run(username, password, keepLogin) {
    return helpers.login(username, password, keepLogin).delay(1000).then(helpers.openBookmarks).then(helpers.extract);
}

var jobs = [];

_.each(config.minutes, function(minute) {
    var rule = new schedule.RecurrenceRule();
    rule.minute = minute;
    jobs.push(schedule.scheduleJob(rule, function() {
        console.log('Running job');
        var read = JSON.parse(fs.readFileSync('lastResult.json'));
        run(config.username, config.password, config.keep_login).then(function(result) {
            console.log('Got result for ' + result.length + ' entries.');
            result.forEach(function(item) {
                var last = _.find(read, function(old) { return old.id == item.id; });
                if((!last || last.status == false) && item.status == true) {
                    sendPush(item);
                }
            });

            console.log('Finished');
            fs.writeFile('lastResult.json', JSON.stringify(result, null, 4));
        });
    }));
});

console.log('Everything scheduled');
