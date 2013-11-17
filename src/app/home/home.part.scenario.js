/**
 * Partial for the page objects associated with clubs
 */
var Page = require('astrolabe').Page;

module.exports = Page.create({
  url: { value: 'index.html' },
  home: { get: function() { return this.findElement(this.by.id('home')); } },
  about: { get: function() { return this.findElement(this.by.id('about')); } },
  readme: { get: function() { return this.findElement(this.by.id('readme')); } },
  gitHub: { get: function() { return this.findElement(this.by.id('gitHub')); } },
  support: { get: function() { return this.findElement(this.by.id('support')); } }
  }
);
