/**
 * Created by meknock on 1/18/2017.
 */
var express = require('express'),
    path = require('path'),
    http = require('http');
var fs = require('fs');
var overpass = require('./routes/overpassService');
var join = path.join;

var app = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'client')));

app.use('development', function() {
    app.use(express.errorHandler());
});

app.get('/api/overpass/bbox/poi/:south/:west/:north/:east/:boxId/:boxSize', overpass.pointOfInterestInBbox);

//app.get('/api/overpass/bbox/poi/all/:allBox', overpass.pointOfInterestInAllBbox); This method is to test if fetching all the data in each box my clicking only once

app.get('/api/overpass/prepare/analyse/data', overpass.prepareAnalyseData);
app.get('/api/overpass/analyse/data', overpass.analyseData);
app.get('/api/overpass/processed/data/all', overpass.getProcessedData);
app.get('/api/overpass/clean/database', overpass.cleanDatabase);

// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('App listening on port ' + port);
});