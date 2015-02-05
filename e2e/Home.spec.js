/**
 * Created by mike on 2/5/2015.
 */

'use strict';
var HomePage = require('./Home.po.js');
var _ = require('lodash');

describe('home Page', function() {
  var homePage;

  var terms = {
    foodSearch: {
      search: 'food',
      lookFor: 'Cocoa',
      line: 1,
      count: 3
    }
  };

  beforeEach(function() {
    homePage = new HomePage();
  });

  it('should have a proper page tab', function() {
    var viewName = homePage.viewTitle;
    viewName.then(function(viewTitle) {
        expect(viewTitle).toEqual('Protractor Sample')
      }
    );
  });

  it('should have an error for bad characters', function() {
    var badSearch = '@@';

    homePage.enterSearch(badSearch);
    var patternMessage = homePage.badTextMessage;
    expect(patternMessage).toContain('Numbers');

  });

  it('should display overflow message', function() {
    var badKeys = 'abcdefghijklmnop';

    homePage.enterSearch(badKeys);
    var tooLongMessage = homePage.longMessage;
    expect(tooLongMessage).toContain('10');

  });

  it('should search for food and get answers', function() {
      var food = terms.foodSearch;
      homePage.enterSearch(food.search);
      homePage.clickSearch().then(
        function() {
          var allElements = homePage.allResults;
          allElements.then(function(results) {
            expect(results).not.toBeNull();
          });
        });
    }
  );

  it('should search for food and find length and keyword', function() {
      var food = terms.foodSearch;
      homePage.enterSearch(food.search);
      homePage.clickSearch().then(
        function() {
          var allElements = homePage.allResults;
          allElements.then(function(results) {

            expect(results.length).toEqual(food.count);

            var target = results[food.line - 1];
            target.getText().then(function(text) {

              expect(text).toContain(food.lookFor);
            });

          });
        });
    }
  );
});
