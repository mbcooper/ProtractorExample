/**
 * Created by mike on 2/4/2015.
 */
/**
 * Created by mike on 1/26/2015.
 */
var express = require('express');
var app = module.exports.app = exports.app = express();
app.use(require('connect-livereload')());

// our logic ...
// jscs: disable
var config = require('./config');
var _ = require('lodash');

var expressJson = require('express-json');
var urlencoded = require('urlencoded-request-parser');
var request = require('request');

var fs = require('fs');

var server = require('http').createServer(app);

var mockFileRoot = config.data_location;

// CONFIG SERVER

var oneHour = 86400000 / 24;

//allows server to run as proxy
app.enable('trust proxy');

// body parser replaced , as was deprecated in connect 3
app.use(expressJson());
app.use(urlencoded());

//serve the "compiled" build folder
app.use(express.static(config.static_site_root,
  {
    maxAge: oneHour
  }
));

// DEFINE ENDPOINTS

// for posts
app.post(config.rest_base_url, function(req, res) {
  var endpoint,
      splitPath = req.params[0].split("/"),
      mockPath = mockFileRoot + splitPath[0],
      mockResponse;

  if (splitPath.length > 2) {
    endpoint = splitPath[splitPath.length - 2];
  }

  console.log(endpoint, req.params[0], splitPath);

  if (splitPath[1]) {
    endpoint = splitPath[1]
  } else {
    endpoint = 'default'
  }

  try {
    mockResponse =
      JSON.parse(fs.readFileSync(mockPath + '/' + endpoint + '.json'));
    // Change the second parameter in this function to a time in milliseconds
    // to mock network latency on http requests
    res.send(200, mockResponse);
  }
  catch (err) {
    console.log(err);
    res.send(500);
  }
});

// for gets == get json file from /data directory
function Get(req, res) {
  var endpoint,
      splitPath = req.params[0].split("/"),
      mockPath = mockFileRoot + splitPath[0],
      mockResponse;

  if (splitPath.length > 2) {
    endpoint = splitPath[splitPath.length - 2];
  }



  if (splitPath[1]) {
    endpoint = splitPath[1]
  } else {
    endpoint = 'default'
  }
  console.log('Get from> ' + endpoint);
  try {
    mockResponse =
      JSON.parse(fs.readFileSync(mockPath + '/' + endpoint + '.json'));
    // Change the second parameter in this function to a time in milliseconds
    // to mock network latency on http requests
    res.send(200, mockResponse);
  }
  catch (err) {
    console.log(err);
    res.send(500);
  }
}

// for gets == get json file from /data directory
app.get(config.rest_base_url, function(req, res) {
  console.log('getting>' + JSON.stringify(req.params));
  Get(req, res);
});

// FIRE IT UP

server.listen(config.port, function() {
  console.log("Express server listening on port %d", config.port);
});
