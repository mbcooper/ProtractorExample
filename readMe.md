#Sample Protractor Project

This project is an illustration of the use of [Angular Protractor](http://angular.github.io/protractor/#/) on a simple Angular project.  It illustrates the use of [Page Objects](http://angular.github.io/protractor/#/page-objects) to abstract the DOM markup from tests, and to encourage re-use.  You'll see the tests are very fluent.

## Setup

1. Clone thus repo.
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

Enter one of the 2 valid search terms: **trees** or **food** and click *Search*.  The results will be display below the search line.