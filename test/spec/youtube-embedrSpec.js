describe('Plugin', function() {
  it('should register the yt jQuery plugin', function() {
    expect($('<div></div>').yt).toBeTruthy();
  });
});
