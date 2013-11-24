/**
 * End to end tests for the home page
 */
var homePage = require('./home.part.scenario.js');
var aboutPage = require('../about/about.part.scenario.js');

describe( 'Navigate to home page', function() {
  it ( 'should allow navigation to the home page', function() {
    homePage.go();
    expect(homePage.home.getText()).toEqual('Home');
    expect(homePage.about.getText()).toEqual('What is it?');
    expect(homePage.readme.getText()).toEqual('Read the Docs');
    expect(homePage.gitHub.getText()).toEqual('Github');
    expect(homePage.support.getText()).toEqual('Support');
    expect(browser.getTitle()).toEqual('Home | ngBoilerplate');
    
    homePage.about.click();
    
    expect(browser.getTitle()).toEqual('What is It? | ngBoilerplate');    
  }); 
});