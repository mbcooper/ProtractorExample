#Sample Protractor Project

This project is an illustration of the use of [Angular Protractor](http://angular.github.io/protractor/#/) on a simple Angular project.  It illustrates the use of [Page Objects](http://angular.github.io/protractor/#/page-objects) to abstract the DOM markup from tests, and to encourage re-use.  You'll see the tests are very fluent.

## Setup

1. Clone this repo.
1. Install node.exe if you haven't already. See [here](http://nodejs.org/).
1. If you don't have gulp installed globally, do so with 
	```javascript
	npm install -g gulp-cli
	```
1. In the directory where you placed the project, set up the node modules.
	```javascript
	npm install
	```
1. You need to update the protractor and the selenium drivers
	```javascript
	npm install -g protractor
	webdriver-manager update
	```
	
Whew!  this gets you a project that will run off a simple home pages that allows a search in a bio database.  
To simplify things, I serve up the results locally, and only **food** and **trees** are valid search terms.  The point of this sample is show how to test.

##The App
The app is a simple screen that presents a search box and a button.  Results are displayed (if any) below the search

###Search
![Search UI](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/search1.PNG)

Enter one of the 2 valid search terms: **trees** or **food** and click *Search*.  The results will be display below the search line.  Ignore the contents.  Its just sample "stuff".

![Search Results](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/searchResult.PNG)

We also have 2 validations on the search box.  It has to meet our simple letters-numbers regexp, and be no more than 10 characters.  IF these are violated, we display an *ng-message* like this:

![Error](https://raw.githubusercontent.com/mbcooper/ProtractorExample/master/docImages/errors.PNG)

##Protractor Tests
So let's dive into the protractor tests, which we find in the **e2e** directory.

###conf.js
	```javascript
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
Page Objects let us provide a shim layer between the DOM that is rendered and the tests.  We can re-use the Objects, and we could define a Menu PO (if we had one) that we could mixin to each PO. 

You can see the [whole file here](https://github.com/mbcooper/ProtractorExample/blob/master/e2e/Home.po.js "Home Page Object"), so let's walk through a few of the basics:

