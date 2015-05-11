(function() {
  'use strict';

  // Global Strings
  var iframeString = 
  '<iframe ' +
   'class="ytIframe" ' +
   'width="%WIDTH%" ' + 
   'height="%HEIGHT%" ' +
   'src="//www.youtube.com/embed/%ID%?%PARAMS%" ' +
   'frameborder="0" ' +
   'autoplay=1 ' +
   'allowfullscreen ' +
  '></iframe>'

  // Lets be uber careful with this :(, I would like to avoid this, but have
  // no idea how YouTube decides when to autoplay or not :/
  var deviceRegex = /iPhone|iPod|iPad|Android|BlackBerry/i
  var mobileBrowser = window.navigator.userAgent.match(deviceRegex);

  // The YoutubeEmbedr Class
  var YoutubeEmbedr = function(elem) {
    var that = this
    that.elem = $(elem)
    that.params = 'autoplay=1'
    that.ratio = [16,9]

    // Start the process
    that.setSize()
    // TODO - if - else here for custom/default bg
    that.setDefaultBgImage()
    that.addPlayButton()

    if (that.elem.data('fluid')) {
      $(window).on('resize', function() {
        that.resize();
      });
    }
    
    var title = that.showTitle();
    if (title === '') {
      that.getTitleBarText()
        .then(function(data) {
          that.addTitleBar(data.entry.title.$t)
          that.elem.find('.play').before(that.elem.find('.text'))
          that.setClick()
        })
    } else if (title) {
      that.addTitleBar(title)
      that.elem.find('.play').before(that.elem.find('.text'))
      that.setClick()
    }

    return that;
  }

  YoutubeEmbedr.prototype.resize = function() {
    var $elem = this.elem;
    $elem.height($elem.width() * this.ratio[1]/this.ratio[0] + 'px')
  }

  YoutubeEmbedr.prototype.showTitle = function() {
    console.log(this.elem.filter('[data-title]'));
    if (this.elem.filter('[data-title]').length === 1) {
      if (this.elem.attr('data-title')) {
        return this.elem.attr('data-title');
      }
      return '';
    } else {
      this.setClick();
      this.elem.find('.play').css('top', '50%')
      return false;
    }
  }

  YoutubeEmbedr.prototype.getId = function() {
    return this.elem.attr('id');
  }

  YoutubeEmbedr.prototype.setSize = function() {
    var _elem = this.elem
    
    // If no height was set, use the ratio to calculate it
    if (_elem.height() === 0)
      _elem.height(_elem.width() * this.ratio[1]/this.ratio[0] + 'px')

    // If no width was set, calculate one
    else if (_elem.width() === 0)
      _elem.width(_elem.height() * this.ratio[0]/this.ratio[1] + 'px')
  }

  YoutubeEmbedr.prototype.setDefaultBgImage = function() {
    this.bgUrl = 'http://i.ytimg.com/vi/' + this.getId() + '/hqdefault.jpg'
    this.elem.css('background-image', 'url(' + this.bgUrl + ')')
  }

  YoutubeEmbedr.prototype.addPlayButton = function() {
    this.elem.append('<div class="play"></div>')
  }

  // Note given the JSONP-ness, you can't catch the error.
  YoutubeEmbedr.prototype.getTitleBarText = function() {
    return $.ajax({
      url: 'http://gdata.youtube.com/feeds/api/videos/' + this.getId() + '?v=2&fields=id,title&alt=json',
      dataType: 'jsonp'
    })
  }

  YoutubeEmbedr.prototype.addTitleBar = function(text) {
    this.elem.append('<a class="text" target="_blank" href="https://www.youtube.com/watch?v=' + this.elem.attr('id') + '">' + text + '</a>')
    this.elem.find('.text').slideDown()
  }

  YoutubeEmbedr.prototype.addParams = function(params) {
    // This is a bit tricky, there is always 1 param set,
    // so I'm just kinda adding the rest. Maybe it's simple...
    this.params += params
  }

  YoutubeEmbedr.prototype.setClick = function() {
    var that = this
    // Sorry Steve W, I'm always gonna use .click!
    this.elem.on('click', function(e) {
      e.stopPropagation()

      if (mobileBrowser) {
        window.location = 'https://www.youtube.com/watch?v=' + that.getId();
        return false;
      }

      that.elem.replaceWith(that.iframeGenerator())
    })
    // Prevent the titlebar from playing the video
    this.elem.find('.text').click(function(e) {
      e.stopPropagation()
    })
  }

  YoutubeEmbedr.prototype.iframeGenerator = function() {
    return iframeString
             .replace(/%WIDTH%/g, this.elem.width())
             .replace(/%HEIGHT%/g, this.elem.height())
             .replace(/%ID%/g, this.elem.attr('id'))
             .replace(/%PARAMS%/g, this.params)
  }

  // jQuery plugin
  // -------------
  $.fn.yt = function() {
    return this.each(function() {
      var $elem = $(this);
      var yte = new YoutubeEmbedr($elem);
      return yte;
    });
  }

})();
