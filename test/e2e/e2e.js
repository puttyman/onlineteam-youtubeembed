require('colors');
var chai = require("chai");
var expect = chai.expect;

var wd = require('wd');

// enables chai assertion chaining
describe('mocha spec examples', function() {
  this.timeout(10000);

  describe("regular mocha usage", function() {
    var browser;

    // Before everything, setup the webdriver
    // Note that selenium must be running
    before(function(done) {
      browser = wd.promiseChainRemote('http://127.0.0.1:4444/wd/hub');
      browser
        .init({browserName:'chrome'})
        .nodeify(done);  //same as : .then(function() { done(); });
    });

    beforeEach(function(done) {
      browser
        .get("http://localhost:8484/")
        .nodeify(done);
    });

    after(function(done) {
      browser
        .quit()
        .nodeify(done);
    });

    it("should retrieve the page title", function(done) {
      browser
        .title()
        .then(function(title) {
          expect(title).to.equal('youtube-embedr');
        })
        .nodeify(done);
    });

  });

});