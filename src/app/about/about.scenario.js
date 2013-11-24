/**
 * End to end tests for the about page
 */
var aboutPage = require('./about.part.scenario.js');

describe( 'Navigate directly to about page', function() {
  it ( 'should allow navigation to the about page', function() {
     
    aboutPage.go();
    expect(browser.getTitle()).toEqual('What is It? | ngBoilerplate');    
  }); 
});
