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
    var text;

    it('should return the id of the element', function() {
      expect(ytE.getId()).toEqual(youtubeId);
    });

    it('should show the title when the attr is not set', function() {
      expect(ytE.hideTitle()).toBe(false);
    });

    it('should hide the title when the attr is set', function() {
      elem.attr('data-title', 'false');
      expect(ytE.hideTitle()).toBe(true);
    });

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

    it('should get the title bar', function() {
      spyOn(ytE, 'getTitleBarText').andReturn('Paul Rocks');
      text = ytE.getTitleBarText();
      expect(text).toEqual('Paul Rocks');
    });

    it('should set the title bar', function() {
      ytE.addTitleBar(text);
      expect(elem.find('.text').length).toEqual(1);
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
  
});