require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;
chai.should();

var wd = require('wd');

var testTimeout = 10000; // 10 seconds
var browser;


// Before anything, setup the session
before(function(done) {
  this.timeout(testTimeout);
  setTimeout(done, testTimeout);
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

    describe('the standard implementation', function() {

      // Load the page just once
      before(function(done) {
        browser
          .get("http://localhost:8484/")
          .nodeify(done);
      })

      var defaultId = '5GedjRxj9EA';
      var defaultHeight = '315px;'

      it("should exist with ID " + defaultId, function(done) {
        browser
          .elementById(defaultId)
          .then(function(element) {
            return expect(element).to.exist;
          })
          .nodeify(done);
      });

      it("should have a height of " + defaultHeight + " and a bg image set", function(done) {
        browser
          .elementById(defaultId)
          .then(function(element) {
            return element.getAttribute('style');
            //return expect(element.getAttribute('style')).to.eventually.contain('height: 315px');
          })
          .then(function(styles) {
            expect(styles).to.contain('height: ' + defaultHeight);
            expect(styles).to.contain('background-image: ')
            expect(styles).to.contain(defaultId);
            return;
          })
          .nodeify(done);
      });

      it("should have a play button", function(done) {
        browser
          .elementById(defaultId)
          .then(function(element) {
            return expect(element.elementByClassName('play')).to.eventually.exist;
          })
          .nodeify(done);
      });

      it("should have a title", function(done) {
        browser
          .elementById(defaultId)
          .then(function(element) {
            return element.elementByClassName('text');
          })
          .then(function (titleElem) {
            expect(titleElem).to.exist;
            return expect(titleElem.text()).to.eventually.be.a('string');
          })
          //.fail(function(e) {
          //  throw new Error("Hit a fail");
          //})
          .nodeify(done);
      });

      it("should play on click", function(done) {
        browser
          .elementById(defaultId)
          .click()
          .elementsByClassName('ytIframe')
          .then(function(elements) {
            expect(elements).to.have.length(1)
            return expect(elements[0].getAttribute('src')).to.eventually.equal('http://www.youtube.com/embed/' + defaultId + '?autoplay=1');
          })
          .nodeify(done);
      });
    });
  
   

   
});