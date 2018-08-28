// Copyright 2018 Nicole M. Lozano. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
/*jslint es6 */
const express = require('express');
const hbs = require('hbs');
const database = require('./database');

(function () {
    'use strict';

    var randomid = (n) => Math.random().toString(16).substring(2, n + 2);

    const frontend_path = './frontend';
    const common_path = `${frontend_path}/common`;

    const dashboard_root = '/' + randomid(16);
    console.log(`Dashboard Root: ${dashboard_root}`);

    var db = database.Database('srat.db');

    var app = express();

    app.use(express.static('frontend'));

    hbs.registerPartials(__dirname + '/frontend/common/views/partials/');
    app.set('view engine', 'hbs');
    app.set('views', [__dirname + '/frontend/dashboard/views', __dirname + '/frontend/common/views']);

    app.use(express.static(common_path));

    app.get(dashboard_root + '/quizzes/list', function (ignore, res) {
        db.list_quizzes(function (err, rows) {
            if (err !== null) {
                res.send({'error': err});
            } else {
                res.send(rows);
            }
        });
    });

    app.use(dashboard_root, function (ignore, res) {
        res.render('dashboard.hbs');
    });

    app.get('/', function (ignore, res) {
        res.redirect('lost.html');
    });

    app.listen(8080);
}());
