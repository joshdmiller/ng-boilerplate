/**
 * End to end tests for the home page
 */

var HomePage = function() {
  this.home = element(by.id('home'));
  this.about = element(by.id('about'));
  this.readme = element(by.id('readme'));
  this.gitHub = element(by.id('gitHub'));
  this.support = element(by.id('support'));
  
  this.get = function() {
    browser.get('index.html');
  };  
};

describe( 'Navigate to home page', function() {
  it ( 'should allow navigation to the home page', function() {
    var homePage = new HomePage();
     
    homePage.get();
    expect(homePage.home.getText()).toEqual('Home');
    expect(homePage.about.getText()).toEqual('What is it?');
    expect(homePage.readme.getText()).toEqual('Read the Docs');
    expect(homePage.gitHub.getText()).toEqual('Github');
    expect(homePage.support.getText()).toEqual('Support');
    expect(browser.getTitle()).toEqual('ng-boilerplate | home');
    
    homePage.clickAbout();
    
    expect(browser.getTitle()).toEqual('ng-boilerplate | about');    
  }); 
});