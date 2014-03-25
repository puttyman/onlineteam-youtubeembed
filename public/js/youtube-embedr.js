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
  var _this = this
  _this.elem = $(elem)
  _this.params = 'autoplay=1'
  _this.ratio = [16,9]

  _this.run = function() {
    _this.setSize()
    // TODO - if - else here for custom/default bg
    _this.setDefaultBgImage()
    _this.addPlayButton()

    if (_this.hideTitle()) {
      return;
    }

    // TODO - Add custom title here...

    _this.getTitleBarText()
      .then(function(data) {
        _this.addTitleBar(data.entry.title.$t)
      })
      .fail(function() {
        if (window.console)
          console.error('Error loading youtube title: ' + _this.getId())
      })
      .always(function() {
        _this.setClick()
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
  var _this = this
  // Sorry Steve W, I'm always gonna use .click!
  this.elem.click(function(e) {
    e.stopPropagation()

    if (mobileBrowser) {
      window.location = 'https://www.youtube.com/watch?v=' + _this.getId();
      return false;
    }

    _this.elem.replaceWith(_this.iframeGenerator())
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




// Dim the lights...iiiiiIIIIIITTT'S TIMMEEEE
$.each($('.youtube'), function() {
  var ytE = new YoutubeEmbedr(this)
  ytE.run()
});



















// Get the ratio of the video, playing it safe
// function setRatioArray() {
//   var elemRatio = elem.attr('data-ratio') // Take a guess what this is

//   // Let's check if they've given us a ratio, and it's valid
//   if (elemRatio) {
//     firstNum = parseInt(elemRatio.split(":")[0], 10)
//     secondNum = parseInt(elemRatio.split(":")[1], 10)
//     if (firstNum && secondNum) {
//       ratioArray = elemRatio.split(":")
//       return
//     }
//   }

//   ratioArray = [16, 9] // Otherwise we'll just return the default 16:9
// }

// Loop through the videos
//$.each($('.youtube'), function() {

  // // Lets be uber careful with this :(, I would like to avoid this, but have
  // // no idea how YouTube decides when to autoplay or not :/
  // var deviceRegex = /iPhone|iPod|iPad|Android|BlackBerry/i
  // var mobileBrowser = window.navigator.userAgent.match(deviceRegex);

  

  // // Set the size of the video
  // function setSize() {
  //   // First we check for a fluid width image
  //   if (elem[0].style.width.indexOf("%") !== -1) {
  //     width = elem[0].style.width
  //     height = (elem.width() * ratioArray[1]) / ratioArray[0]
  //   } else {


  //     // If elem has height AND width defined, fix the size of it
  //     if (elem.height() && elem.width()) {
  //       width = elem.width()
  //       height = elem.height()
  //     }
  //     // If we only have a width, do dee da do do bah
  //     else if (elem.width()) {
  //       width = elem.width();
  //       height = (elem.width() * ratioArray[1]) / ratioArray[0]
  //     }
  //     // I suppose we might only have a height too
  //     else if (elem.height()) {
  //       height = elem.height();
  //       width = (elem.height() * ratioArray[0]) / ratioArray[1]
  //     }
  //     else
  //       if (elem.attr('data-ratio'))
  //         height = (width * ratioArray[1]) / ratioArray[0]
  //   }

  //   // Set a the size
  //   elem.css({
  //     width: width,
  //     height: height
  //   })
  // }

  // // Centres the image vertically
  // function centreImage() {
  //   if (elem.attr('data-image-src')) {
  //     thumb.css('top', 0)
  //     return
  //   }
  //   var RATIO = 16/9,
  //   BLACK_SPACE_RATIO = 1.5,
  //   marginTop

  //   marginTop = -elem.width()/RATIO/BLACK_SPACE_RATIO
  //   thumb.css('margin-top', marginTop+'px')
  // }

  // // If we want to be fluid, we'll need to readjust the size and positioning
  // // whenever we resize the window
  // function makeFluid() {
  //   var originalResizeEvent,
  //   height
  //   if (elem.attr('data-fluid') === 'true') {
  //     originalResizeEvent = window.onresize
  //     window.onresize = function() {
  //       if (originalResizeEvent)
  //         originalResizeEvent()
  //       elem.css('height', (elem.width() * ratioArray[1]) / ratioArray[0])
  //       centreImage()
  //     }
  //   }
  // }

  // Start the show!
  // var elem = $(this),
  // width = 420,
  // height = 315,
  // id = elem.attr('id'),
  // ratioArray,
  // ytParams = "autoplay=1",
  // thumb, linkContainer, link, playbackmask, play, ytIframe, marginTop, url

  // //setRatioArray()
  // //setSize()
  // //makeFluid()

  // // Create the image asset
  // thumb = $(document.createElement('img'))
  // thumb.addClass('thumb')
  // if (elem.attr('data-image-src'))
  //   thumb.attr('src', elem.attr('data-image-src'))
  // else
  //   thumb.attr('src', 'http://i.ytimg.com/vi/'+id+'/hqdefault.jpg')
  // centreImage()

  // // Create the link element (the video heading)
  // linkContainer = $(document.createElement('div'))
  // link = $(document.createElement('a'))
  // link.attr('target', '_blank')
  // linkContainer.addClass('text').html(link)

  // playbackmask = $(document.createElement('div'))
  // playbackmask.addClass('playbackmask')

  // // Create the play button
  // play = $(document.createElement('div')).addClass('play')
  // play.addClass('play')

  // // Append these elements into the elem
  // elem.append(thumb, play, playbackmask, linkContainer)

  // // Ajax get the video title
  // url = 'http://gdata.youtube.com/feeds/api/videos/' + id +
  // '?v=2&fields=id,title&alt=json'
  // $.ajax({
  //   url: url,
  //   dataType: 'jsonp',
  //   success: function(data, textStatus, jqXHR) {
  //     link.attr("href","https://www.youtube.com/watch?v=" + id)
  //     link.html(data.entry.title.$t)
  //     // Now set the playbackmask height
  //     playbackmask.css({
  //       'height': height - (link.height() + 10) +'px',
  //       'top': link.height() + 10 +'px'
  //     })
  //   }
  // })

  // // When clicked, create the iframe replace the elem with it
  // $(playbackmask).click(function() {
  //   if (mobileBrowser) {
  //     window.location = "https://www.youtube.com/watch?v=" + id
  //     return
  //   }

  //   if (elem.attr('data-yt-params'))
  //     ytParams += "&" + elem.attr('data-yt-params')

  //   ytIframe = $(document.createElement('iframe'))
  //   var embedCode = 'https://www.youtube.com/embed/' + id + "?" + ytParams
  //   ytIframe.addClass('ytIframe')
  //   ytIframe.attr('src', embedCode)
  //   ytIframe.attr('width', elem.width())
  //   ytIframe.attr('height', elem.height())
  //   ytIframe.attr('frameborder', 0)
  //   ytIframe.attr('allowfullscreen', '')
  //   $(elem).replaceWith(ytIframe)
  // })

  // playbackmask.hover(function() {
  //   $(this).siblings('.play').css("background-position","0px -74px")
  // }, function() {
  //   $(this).siblings('.play').css("background-position","0px 0px")
  // })

//})
