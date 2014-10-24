/*! youtube-embedr - v0.0.1 - 2014-10-24 */

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

  that.run = function() {
    that.setSize()
    // TODO - if - else here for custom/default bg
    that.setDefaultBgImage()
    that.addPlayButton()

    if (that.hideTitle()) {
      return;
    }

    // TODO - Add custom title here...

    that.getTitleBarText()
      .then(function(data) {
        that.addTitleBar(data.entry.title.$t)
      })
      .fail(function() {
        if (window.console)
          console.error('Error loading youtube title: ' + that.getId())
      })
      .always(function() {
        that.setClick()
      })
  } 
}

YoutubeEmbedr.prototype.hideTitle = function() {
  if (this.elem.attr('data-title') === 'false') {
    this.setClick();
    this.elem.find('.play').css('top', '50%')
    return true;
  }
  return false;
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
  this.elem.click(function(e) {
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
