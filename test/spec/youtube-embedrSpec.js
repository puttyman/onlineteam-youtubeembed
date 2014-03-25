describe('My Youtube Embedr Class', function() {

  var ytE, youtubeId, height, width, elem;

  beforeEach(function() {

    youtubeId = '12345';
    height = '360px';
    width = '500px';
    
    elem = $(document.createElement('div'))
               .addClass('youtube')
               .attr('id', youtubeId)
               .css({
                width: width,
                height: height
               });

    ytE = new YoutubeEmbedr(elem);
  });



  // Setup of the element
  describe('Setup the element', function() {
    it('should have class youtube', function() {
      expect(elem.hasClass('youtube')).toBe(true);
    });
    it('should have an id of ' + youtubeId, function() {
      expect(elem.attr('id')).toEqual(youtubeId);
    });
    it('should have a height of ' + height, function() {
      expect(elem.css('height')).toEqual(height);
    });
    it('should have a width of ' + width, function() {
      expect(elem.css('width')).toEqual(width);
    });
    it('should have a default ratio of 16:9', function() {
      expect(ytE.ratio).toEqual([16,9]);
    });
  });


  // Defaults for the ytE object
  describe('Default values of the ytE object', function() {
    it('should have the element set as variable', function() {
      expect(ytE.elem).toEqual(elem);
    })
    it('should have a ratio of 16/9', function() {
      expect(ytE.ratio).toEqual([16,9]);
    })
    it('should have a defaul paramter of autoplay', function() {
      expect(ytE.params).toEqual('autoplay=1');
    })
  });
  
  

  // The individual unit tests for each function
  describe('Testing of functions', function() {
    it('should be set the background image', function() {
      ytE.setDefaultBgImage();
      expect(elem.css('background-image')).toContain('http://i.ytimg.com');
      expect(elem.css('background-image')).toContain(youtubeId);
    });
    it('should be set the correct size when height and width are specified', function() {
      ytE.setSize();
      expect(elem.css('height')).toEqual(height);
      expect(elem.css('width')).toEqual(width);
    });
    it('should be set the correct size when only height specified', function() {
      elem.css('width', '0px');
      expect(elem.css('width')).toEqual('0px');
      ytE.setSize();

      var newSize = elem.height() * ytE.ratio[0] / ytE.ratio[1];
      expect(elem.css('height')).toEqual(height);
      expect(elem.css('width')).toEqual(newSize + 'px');
    });
    it('should be set the correct size when only width specified', function() {
      elem.css('height', '0px');
      expect(elem.css('height')).toEqual('0px');
      ytE.setSize();

      var newSize = elem.width() * ytE.ratio[1] / ytE.ratio[0];
      expect(elem.css('height')).toEqual(newSize + 'px');
      expect(elem.css('width')).toEqual(width);
    });
    it('should add the play button', function() {
      ytE.addPlayButton();
      expect(elem.find('.play')[0]).toBeDefined();
    });
    var text;
    it('should get the title bar', function() {
      spyOn(ytE, 'getTitleBarText').andReturn('Paul Rocks');
      text = ytE.getTitleBarText();
      expect(text).toEqual('Paul Rocks');
    });
    it('should set the title bar', function() {
      ytE.addTitleBar(text);
      expect(elem.find('.text')[0]).toBeDefined();
      expect(elem.find('.text').html()).toContain('Paul Rocks');
      expect(elem.find('.text').attr('target')).toEqual('_blank');
      expect(elem.find('.text').attr('href')).toContain(youtubeId);
    });
    it('should add click behaviour', function() {
      spyOn(ytE, 'setClick');
      ytE.setClick();
      expect(ytE.setClick).toHaveBeenCalled();
    });
  });


  // The run function
  describe('Putting it all together in run', function() {

    beforeEach(function() {
      spyOn(ytE, 'getTitleBarText').andCallFake(function (req) {
        var d = $.Deferred();
        var data = {
          entry: {
            title: {
              $t: 'Paul Rocks'
            } 
          }
        };
        d.resolve(data);
        return d.promise();
      });
      spyOn(ytE, 'setClick');
    });

    afterEach(function() {
      delete ytE;
    });

    it('should have set the size', function() {
      ytE.run();
      expect(elem.css('height')).toEqual(height);
      expect(elem.css('width')).toEqual(width);
    });
    it('should have set background the image', function() {
      ytE.run();
      expect(elem.css('background-image')).toContain('http://i.ytimg.com');
      expect(elem.css('background-image')).toContain(youtubeId);
    });
    it('should have added the play button', function() {
      ytE.run();
      expect(elem.find('.play').length).toEqual(1);
    });
    it('should have added the title bar text', function() {
      ytE.run();
      expect(elem.find('.text').html()).toEqual('Paul Rocks');
    });
    it('should have set the click', function() {
      ytE.run();
      expect(ytE.setClick).toHaveBeenCalled();
    });
    it('should have set the click even if get failed', function() {
      ytE.run();
      expect(ytE.setClick).toHaveBeenCalled();
    });
  });


  // The run function with a failed get title call
  describe('Running without a failed title call', function() {

    beforeEach(function() {
      spyOn(ytE, 'getTitleBarText').andCallFake(function (req) {
        var d = $.Deferred();
        d.reject('Fail');
        return d.promise();
      });
      spyOn(ytE, 'setClick');
      // Mock the console.error function to hide output
      console.error = function() {
        return;
      }
    });

    afterEach(function() {
      delete ytE;
    });

    it('should have set the size', function() {
      ytE.run();
      expect(elem.css('height')).toEqual(height);
      expect(elem.css('width')).toEqual(width);
    });
    it('should have set background the image', function() {
      ytE.run();
      expect(elem.css('background-image')).toContain('http://i.ytimg.com');
      expect(elem.css('background-image')).toContain(youtubeId);
    });
    it('should have added the play button', function() {
      ytE.run();
      expect(elem.find('.play').length).toEqual(1);
    });
    it('should have added the title bar text', function() {
      ytE.run();
      expect(elem.find('.text').length).toEqual(0);
    });
    it('should have set the click', function() {
      ytE.run();
      expect(ytE.setClick).toHaveBeenCalled();
    });
  });


  
  
});