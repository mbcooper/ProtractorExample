#A Working Angular - Protractor Project

This project is a ***working project, an illustration*** of the use of [Angular Protractor](http://angular.github.io/protractor/#/) on a simple Angular project.  It illustrates the use of [Page Objects](http://angular.github.io/protractor/#/page-objects) to abstract the DOM markup from tests, and to encourage re-use.  You'll see that the tests are very fluent.

## Setup

1. Clone this repo.
1. Install node.exe if you haven't already. See [here](http://nodejs.org/).
1. If you don't have gulp installed globally, do so with 
	```
	npm install -g gulp-cli
	```
1. In the directory where you placed the project, set up the node modules.
	```
	npm install
	```
1. You need to update the protractor and the selenium drivers
	```
	npm install -g protractor
	webdriver-manager update
	```
	
Whew!  this gets you a project that will run a simple home page that allows a search in a magical bio database.  
To simplify things, I serve up the results locally, and only **food** and **trees** are valid search terms.  (The point of this example is show how to test).

##The App
The app is a simple screen that presents a search box and a button.  Results are displayed (if any) below the search

###Search
![Search UI](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/search1.PNG)

Enter one of the 2 valid search terms: **trees** or **food** and click *Search*.  The results will be display below the search line.  Ignore the contents.  Its just sample "stuff".

![Search Results](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/searchResult.PNG)
#####[Validation Errors](#validation-errors)
We also have 2 validations on the search box.  It has to meet our simple letters-numbers regexp, and be no more than 10 characters.  IF these are violated, we display an `ng-message` like this:

![Error](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/errors.PNG)

##Protractor Tests
So let's dive into the protractor tests, which we find in the **e2e** directory.

###conf.js
We configure our tests to point at our selenium (Protractor) driver and our running app.

```JavaScript
	exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['**/*.spec.js'],
	baseUrl: '',
	capabilities: {
		'browserName': 'chrome'
	},
	jasmineNodeOpts: {
		showColors: true
	},
	env: {
		baseUrl: 'http://localhost:3444/#'
		}
	};
```

The key items here: are the `seleniumAddress` (which is a default), and the `env.baseUrl`, which is a standard adopted from ngBoilerplate.

###Home.po.js - Our Page Object
Page Objects let us provide a shim layer between the DOM that is rendered and the tests.  This is highly flexible and has the power of finding elements by our Angular models! 

You can see the [whole Page Object file here](https://github.com/mbcooper/ProtractorExample/blob/master/e2e/Home.po.js "Home Page Object"), and the [Home Page Template](https://github.com/mbcooper/ProtractorExample/blob/master/src/app/home/home.tpl.html "template") here, so let's walk through a few of the basics:

####Home Page Contructor

We're using the `ControllerAs` syntax in our Home Controller app, so our scope variables will be exposed as `home.`. 
We create an export object for the Home Page:

```JavaScript
	var HomePage = function() {
		browser.get(env.baseUrl + '/home');
	};

	module.exports = HomePage;
```
####Reading DOM Elements
For each item on the view that we want to access, we write a getter on the `HomePage prototype`.

```JavaScript
HomePage.prototype = Object.create(
  {}, {
    searchBox: {
      get: function() {
        return element(by.model('home.search'))
      }
    },
```
This snippet shows us *locating* the element using the view model itself!  *Now, this is very cool, because we could dramatically alter the DOM template and the Protractor test will still function.*

####Typing Into TextBoxes
We can use the getter in the previous section and add the method `.sendKeys` to enter text:

```JavaScript
 enterSearch: {
      value: function(keys) {
        return this.searchBox.sendKeys(keys);
      }
    },
```
####Clicking on Buttons
Similarly, we can find a button and click on it.
 
```JavaScript
	{
	searchButton:
      get: function() {
        return element(by.id('searchButton'));
      }
    },
    clickSearch: {
      value: function() {
        return this.searchButton.click();
      }
    },
```

####Get the Results of the Search
I must say this is very cool.  All we have to do is ask for the repeater part of the model when we get the results:
```JavaScript
 	allResults: {
      get: function() {
        var bioElement = element.all(by.repeater('bio in home.results'));
        return bioElement;
      }
    },
```
So now we have created an abstraction for the page using the Home Page Object.

Let's proceed to our test spec.

###Home.spec.js - The Home Page Test

The full test spec is [here](https://github.com/mbcooper/ProtractorExample/blob/master/e2e/Home.spec.js). We'll focus on building up the parts.
####Require the Page Object
```JavaScript
	var HomePage = require('./Home.po.js');
```
####Setup the Test and Instantiate a New Home Page Object Before Each Test
```JavaScript
describe('home Page', function() {
  var homePage;

  beforeEach(function() {
    homePage = new HomePage();
  });
```
####Check the Browser Title
```JavaScript
  it('should have a proper page tab', function() {
    var viewElem = homePage.viewTitle;
    viewElem.then(function(viewTitle) {
        expect(viewTitle).toEqual('Protractor Sample')
      }
    );
  });
```
This simple example stumped me at first until I realized that most of the Page Object returns are promises that need to be resolved.  What an easy task!  No `timeouts` or waits.  Protractor handles that all for us and gives us our favorite object -- the [promise](https://www.promisejs.org/).

####Check That Validation Errors are Displayed
Remember [above](#validation-errors) that we show an `ng-message` when we have validation errors.  We defined these in the Page Object by using the css locator: `by.css('[ng-message="pattern"]')`.  This allows us to write a test to see if the error message ("Numbers or Letters Only") actually appears.

```JavaScript
  it('should have an error for bad characters', function() {
    var badSearch = '@@';
    homePage.enterSearch(badSearch);
    var patternMessage = homePage.badTextMessage;
    expect(patternMessage).toContain('Numbers');
  });
```

####Do a Search and Get Answers. Check Number of Responses and Expected Answer
Now for the grand test.  We'll enter a search term ("food"), click on Search and look for answers.  We'll check to make sure there are 3 rows, and that the word "Cocoa" is in the answer.  Remember, many of the responses are promises.

```JavaScript
  it('should search for food and find length and keyword', function() {
      homePage.enterSearch('food');
      homePage.clickSearch().then(
        function() {
          var allElements = homePage.allResults;
          allElements.then(function(results) {

            expect(results.length).toEqual(3);

            var target = results[food.line - 1];
            target.getText().then(function(text) {

              expect(text).toContain('Cocoa');
            });

          });
        });
    }
  );
```
Notice how fluent the test statements are: `enterSearch`, `clickSearch` and `allResults`.  No matter how the DOM template changes, as long as the model bindings remain the same, we have a stable test. (OK - the button is by `id`).

If we do change bindings, we only have to change the Page Object once ... all our specs remain stable.

##Running The Tests
So, fasten your seat belts and let's take Protractor for a test run.

You will need to be running 3 terminal sessions to run the tests.  I use WebStorm, which makes opening the sessions easy.

1. Terminal 1 runs our app. (Use the default `gulp` task, included in the project.
	```
		gulp
	```

2. Terminal 2 runs the Protractor / Selenium server on port 4444.
	```
		webdriver-manager update
	```

3. Terminal 3 runs the protractor tests:
	```
		protractor e2e/conf.js
	```

So when we run the tests, we should see the Chrome browser pop up and our test suite run.

![Test Run](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/testSuite.PNG)


##Ya Baby
I must say, this has come a long way in the past 2 years that I've been involved with the Angular world.

Are e2e / functional tests the be-all and end-all?  No, but when judiciously combined with effective unit test coverage, you can produce a high quality software product, with tests that can survive a lot of change.

###Can I Test a Deployed Version of the App?
Darn!  I was afraid your were going to ask that!  Yes!  And No!

If you deployed with debug information off (`$compileProvider.debugInfoEnabled(false);`), you have to instruct Chrome to reload with debug on. (A Guinea for someone who will show us how!)

If not, just point at the deployed site in `e2e/config.js` and run the tests!