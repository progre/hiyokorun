var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.configure(function () {
    app.set('port', 3000);
    app.use(express.static(path.join(__dirname, 'public')));
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
