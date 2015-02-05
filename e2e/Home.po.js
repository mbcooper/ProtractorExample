/**
 * Created by mike on 2/5/2015.
 */
var _ = require('lodash');
var config = require('./conf.js').config;

var env = config.env;

'use strict';
/**
 * @class HomePage
 * @constructor
 */
var HomePage = function() {

  browser.get(env.baseUrl + '/home');
};

HomePage.prototype = Object.create(
  {}, {
    viewTitle: {
      get: function() {

        return browser.getTitle();
      }
    },
    searchBox: {
      get: function() {
        return element(by.model('home.search'))
      }
    },

    searchButton: {
      get: function() {
        return element(by.id('searchButton'));
      }
    },

    enterSearch: {
      value: function(keys) {
        return this.searchBox.sendKeys(keys);
      }
    },
    clearSearch: {
      value: function() {

        return this.searchBox.clear();
      }
    },
    clickSearch: {
      value: function() {
        return this.searchButton.click();
      }
    },

    allResults: {
      get: function() {
        var bioElement = element.all(by.repeater('bio in home.results'));
        return bioElement;
      }
    },

    badTextMessage: {
      get: function() {
        return element(by.css('[ng-message="pattern"]')).getText();
      }
    },
    longMessage: {
      get: function() {
        return element(by.css('[ng-message="maxlength"]')).getText();
      }
    }
  }
);

module.exports = HomePage;
