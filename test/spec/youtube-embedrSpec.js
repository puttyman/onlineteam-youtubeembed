describe('My __toInt function', function() {
  it('should convert a string number to an int', function() {
    expect(__toInt('5px')).toEqual(5);
  });

  it('should return NaN for an unparsable string', function() {
    expect(__toInt('paul')).toBeNaN();
  });
});

describe('My Youtube Embedr Class with height and width set', function() {

  var ytE;
  var youtubeId = '12345';
  var height = '300px';
  var width = '500px';

  // Create the element
  var elem = $(document.createElement('div'))
               .addClass('youtube')
               .attr('id', youtubeId)
               .css('height', height)
               .css('width', width);

  ytE = new YoutubeEmbedr(elem);


  // Setup of the element
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

  // Defaults
  it('should have the element set as variable', function() {
    expect(ytE.elem).toEqual(elem);
  })
  it('should have a ratio of 16/9', function() {
    expect(ytE.ratio).toEqual([16,9]);
  })
  it('should have a defaul paramter of autoplay', function() {
    expect(ytE.params).toEqual('autoplay=1');
  })

  // Runtime Functions
  it('should be set the background image', function() {
    ytE.setDefaultBgImage();
    expect(elem.css('background-image')).toContain('http://i.ytimg.com');
    expect(elem.css('background-image')).toContain(youtubeId);
  });
  it('should be set the correct size', function() {
    ytE.setSize();
    expect(elem.css('height')).toEqual(height);
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