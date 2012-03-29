var vows = require('vows'),
    assert = require('assert'),
    mediaFactory = require('../../lib/mediaplayerlib').mediaFactory;

var youtube = {
  "@type": "VideoObject",
  "embedURL": "http://www.youtube.com/v/jOUAIRbrv6s?version=3&f=videos&app=youtube_gdata"
};

var vimeo = {
  "@type": "VideoObject",
  "itemType": "VideoObject",
  "embedURL": "http://player.vimeo.com/video/1024832"
};

var mp4 = {
  "@type": "VideoObject",
  "itemType": "VideoObject",
  "contentURL": "http://medias2.francetv.fr/videosread/francetv/m//hbbtv-philips/2012/S13/J3/61232926-20120328-1400k.mp4"
};

var videoHelpers = {
  youtube: function(options) {
    return function() {
      mediaFactory.resolve(youtube, options).toHtml(this.callback);
    }
  },
  vimeo: function(options) {
    return function() {
      mediaFactory.resolve(vimeo, options).toHtml(this.callback);
    }
  },
  mp4: function(options) {
    return function() {
      mediaFactory.resolve(mp4, options).toHtml(this.callback);
    }
  },
  unknown: function() {
    return function(options) {
      mediaFactory.resolve({}, options).toHtml(this.callback);
    }
  },
  noError: function(err, html) {
    assert.isNull(err);
  },
  iframe: function(err, html) {
    assert.isNotNull(html.match(/<iframe[^>]*>/));
  },
  html5: function(err, html) {
    assert.isNotNull(html.match(/<video[^>]*>/));
  },
  flashFallback: function(err, html) {
    assert.isNotNull(html.match(/video-js/));
  },
  noFlashFallback: function(err, html) {
    assert.isNull(html.match(/video-js/));
  }
}

vows.describe('Media Player Lib').addBatch({
  'Using the default strategy on a Youtube video': {
    topic: videoHelpers.youtube(),
    'should not return an error': videoHelpers.noError,
    'should return an iframe': videoHelpers.iframe
  },
  'Using the default strategy on a Videmo video': {
    topic: videoHelpers.vimeo(),
    'should not return an error': videoHelpers.noError,
    'should return an iframe': videoHelpers.iframe
  },
  'Using the default strategy on an mp4 video': {
    topic: videoHelpers.mp4(),
    'should not return an error': videoHelpers.noError,
    'should return an html5 video': videoHelpers.html5,
    'should have a Flash fallback': videoHelpers.flashFallback
  },
  //--------------------------------------------------------------------------
  'Using the html5 strategy on a Youtube video': {
    topic: videoHelpers.youtube({strategy: 'html5'}),
    'should not return an error': videoHelpers.noError,
    'should return an iframe': videoHelpers.iframe
  },
  'Using the html5 strategy on a Videmo video': {
    topic: videoHelpers.vimeo({strategy: 'html5'}),
    'should not return an error': videoHelpers.noError,
    'should return an iframe': videoHelpers.iframe
  },
  'Using the html5 strategy on an mp4 video': {
    topic: videoHelpers.mp4({strategy: 'html5'}),
    'should not return an error': videoHelpers.noError,
    'should return an html5 video': videoHelpers.html5,
    'should not have a Flash fallback': videoHelpers.noFlashFallback
  },
}).export(module);
