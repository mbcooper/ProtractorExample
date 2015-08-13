/**
 * Created by mike on 2/4/2015.
 */
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var fs = require('fs');
var _ = require('lodash');
var http = require('http');
var express = require('express');
var expressJson = require('express-json');
var urlencoded = require('urlencoded-request-parser');
var request = require('request');
var connectLivereload = require('connect-livereload');

function handleRequest(req, res) {
  var splitPath = req.params[0].split('/');
  var mockPath = mockFileRoot + splitPath[0];
  var mockResponse;
  var endpoint;

  if (splitPath.length > 2) {
    endpoint = splitPath[splitPath.length - 2];
  }

  if (splitPath[1]) {
    endpoint = splitPath[1]
  } else {
    endpoint = 'default'
  }

  console.log(req.method + ' > ' + endpoint);
  console.log('Params > ' + JSON.stringify(req.params));

  try {
    mockResponse = JSON.parse(fs.readFileSync(mockPath + '/' + endpoint + '.json'));
    // Change the second parameter in this function to a time in milliseconds
    // to mock network latency on http requests
    res.status(200).send(mockResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send('No data');
  }
}

// CONFIG SERVER
var config = require('./config');
var mockFileRoot = config.data_location;
var oneHour = 86400000 / 24;

var app = express();
var server = http.createServer(app);

app.enable('trust proxy'); // allows server to run as proxy
app.use(connectLivereload());
app.use(expressJson()); // body parser replaced , as was deprecated in connect 3
app.use(urlencoded());

// Serve the "compiled" build folder
app.use(express.static(config.static_site_root, {maxAge: oneHour}));

// DEFINE ENDPOINTS
app.post(config.rest_base_url, handleRequest);
app.get(config.rest_base_url, handleRequest);

// FIRE IT UP
server.listen(config.port, function() {
  console.log('Express server listening on port %d', config.port);
});