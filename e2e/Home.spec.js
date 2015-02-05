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

    },
    treeSearch: {
      code: 'trees',
      lookFor: 'Hogenom',
      line: 2,
      count: 21
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

  it('should search for food', function() {
      var food = terms.foodSearch;
      homePage.enterSearch(food.search);
      homePage.clickSearch().then(
        function() {
          var allElements = homePage.allResults;
          console.log('ae fns>' + _.functions(allElements));
          console.log('>' + JSON.stringify(allElements));
          allElements.then(function(results) {

            expect(results).not.toBeNull();
            expect(results.length).toEqual(food.count)

            var target = results[food.line];
            console.log('> the 1' + JSON.stringify(target));

          });
        });
    }
  );
});