var Promise = require('bluebird');
var request = require('request');
var cookieStore = require('tough-cookie-filestore');
var jar = request.jar(new cookieStore('cookies.json'));
request = request.defaults({jar: jar});
var cheerio = require('cheerio');

module.exports = {
    login: function(username, password, keepLogin) {
        return new Promise(function(resolve, reject) {
            request('http://proxer.me', function(error, response, body) {
                if(error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        }).then(function(body) {
            return new Promise(function(resolve, reject) {
                var $ = cheerio.load(body);
                if($('#uname').length == 0) {
                    var formValues = $('#login-form').serializeArray();
                    var formData = {};
                    formValues.forEach(function(keyValuePair) {
                        formData[keyValuePair.name] = keyValuePair.value;
                    });

                    formData.username = username;
                    formData.password = password;
                    formData.remember = keepLogin ? 'yes' : 'no';

                    request.post({url: 'http://proxer.me/component/users/?task=user.login', headers: { 'User-Agent': 'Mozilla/5.0 (BeepBeep) Chrome/43.0.2357.81' }, form: formData}, function(error, response, body) {
                        if(error) {
                            reject(error);
                        } else {
                            console.log('logged in');
                            resolve('login');
                        }
                    });
                } else {
                    console.log('was already logged in.');
                    resolve('loggedIn');
                }
            });
        });
    },

    openBookmarks: function() {
        return new Promise(function(resolve, reject) {
            request({ url: 'http://proxer.me/ucp?s=reminder', jar: jar }, function(err, response, body) {
                if(err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    extract: function(page) {
        return new Promise(function(resolve) {
            var $ = cheerio.load(page);
            var tables = $('table#box-table-a');
            var contents = [];
            tables.each(function(i, elem) {
                $(this).find('tr').each(function(i2, row) {
                    if(!('id' in row.attribs)) {
                        return;
                    }

                    var entryId = row.attribs.id;
                    var infos = row.children;
                    var dataName = infos[1].children[0];
                    var title = {};
                    title.name = dataName.children[0].data;
                    title.status = /online/.test(infos[5].children[0].attribs['data-cfsrc']);
                    title.id = /Cover:(.+)/.exec(dataName.attribs.title)[1];
                    title.link = 'http://proxer.me' + dataName.attribs.href;
                    contents.push(title);
                });
            });

            resolve(contents);
        });
    }
};
