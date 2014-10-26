describe('valid youtube video', function() {

  var youtubeId, yte, $yte, validTitleUrl;

  beforeEach(function() {
    youtubeId = '12345';
    yte = $('<div class="youtube" id="' + youtubeId + '"></div>');
    validTitleUrl = 'http://gdata.youtube.com/feeds/api/videos/' + youtubeId + '?v=2&fields=id,title&alt=json'
    
    // Setup AJAX spy
    spyOn(jQuery, 'ajax')
      .andCallFake(function(options) {
        var deferred = $.Deferred();

        deferred.resolve({
          entry: {
            title: {
              "$t":"Dr. Suess's Sleep Book"
            }
          }
        });

        return deferred.promise();
      });

    $yte = yte.yt();
  });

  it('should have a default background image', function() {
    expect($yte.css('background-image')).toEqual('url(http://i.ytimg.com/vi/12345/hqdefault.jpg)');
  })

  it('should have a title', function() {
    expect($yte.children('.text').text()).toEqual('Dr. Suess\'s Sleep Book');
  });

  it('should have a title with the correct link', function() {
    expect($yte.children('.text').attr('href')).toEqual('https://www.youtube.com/watch?v=' + youtubeId);
  });

  it('should have a play button', function() {
    expect($yte.children('.play').length).toEqual(1);
  });

  it('should do something on click', function() {
    $('body').append('<div id="spec-container"></div>');

    $('#spec-container').append(yte);
    $('#spec-container .youtube').yt();
    $('#spec-container .youtube').click();

    expect($('iframe').length).toEqual(1);
    $('#spec-container').empty();
  });
});
