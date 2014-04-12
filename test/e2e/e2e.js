require('colors');
var chai = require("chai");
var expect = chai.expect;

var wd = require('wd');

var testTimeout = 10000; // 10 seconds
var browser;

// Before anything, setup the session
before(function(done) {
  this.timeout(testTimeout);
  browser = wd.promiseChainRemote('http://127.0.0.1:4444/wd/hub');
  browser
    .init({browserName:'chrome'})
    .nodeify(done);  //same as : .then(function() { done(); });
});

// After all, finish the session
after(function(done) {
  browser
    .quit()
    .nodeify(done);
});



/**
 * Start the Test suite!
 */
describe('youtube embedr tests', function() {
    
    // Start the session
    beforeEach(function(done) {
      browser
        .get("http://localhost:8484/")
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

    it("should have 4 youtube videos", function(done) {
      browser
        .elementsByClassName('youtube')
        .then(function(elements) {
          expect(elements).to.have.length(4);
        })
        .nodeify(done);
    });

    it("should get one by id", function(done) {
      browser
        .elementById('GOtxJrzp6ls')
        .then(function(element) {
          expect(element.getAttribute('id')).to.become('123');
          //return element.getAttribute('id');
        })
        //.then(function(id) {
        //  expect(id).to.equal('GOtxJrzp6ls');
        //})
        .nodeify(done);
    });
});