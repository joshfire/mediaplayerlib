var vows = require('vows'),
    assert = require('assert'),
    mediaFactory = require('../../lib/mediaplayerlib').mediaFactory;

var youtube = {
  "@type": "VideoObject",
  "playerType": "iframe",
  "embedURL": "http://www.youtube.com/v/jOUAIRbrv6s?version=3&f=videos&app=youtube_gdata"
};

var vimeo = {
  "@type": "VideoObject",
  "itemType": "VideoObject",
  "playerType": "iframe",
  "embedURL": "http://player.vimeo.com/video/1024832",
  "url": "https://vimeo.com/1024832"
};

var mp4 = {
  "@type": "VideoObject",
  "itemType": "VideoObject",
  "contentURL": "http://medias2.francetv.fr/videosread/francetv/m//hbbtv-philips/2012/S13/J3/61232926-20120328-1400k.mp4"
};

var mp3 = {
  "@type": "AudioObject",
  "contentURL": "http://www.largesound.com/ashborytour/sound/brobob.mp3"
};

var script = {
  "@type": "VideoObject",
  "itemType": "VideoObject",
  "playerType": "script",
  "embedURL": "http://google.com"
};

var helpers = {
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
  mp3: function(options) {
    return function() {
      mediaFactory.resolve(mp3, options).toHtml(this.callback);
    }
  },
  scriptTest: function(options) {
    return function() {
      mediaFactory.resolve(script, options).toHtml(this.callback);
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
  html5Video: function(err, html) {
    assert.isNotNull(html.match(/<video[^>]*>/));
  },
  html5Audio: function(err, html) {
    assert.isNotNull(html.match(/<audio[^>]*>/));
  },
  script: function(err, html) {
    assert.isNotNull(html.match(/<script[^>]*>/));
  },
  flashFallback: function(err, html) {
    assert.isNotNull(html.match(/video-js/));
  },
  noFlashFallback: function(err, html) {
    assert.isNull(html.match(/video-js/));
  }
};

vows.describe('Media Player Lib').addBatch({
  'Using the default strategy on a Youtube video': {
    topic: helpers.youtube(),
    'should not return an error': helpers.noError,
    'should return an iframe': helpers.iframe
  },
  'Using the default strategy on a Vimeo video': {
    topic: helpers.vimeo(),
    'should not return an error': helpers.noError,
    'should return an iframe': helpers.iframe
  },
  'Using the default strategy on an mp4 video': {
    topic: helpers.mp4(),
    'should not return an error': helpers.noError,
    'should return an html5 video': helpers.html5Video,
    'should have a Flash fallback': helpers.flashFallback
  },
  'Using the default strategy on an script embed': {
    topic: helpers.scriptTest(),
    'should not return an error': helpers.noError,
    'should return a script': helpers.script
  },
  //--------------------------------------------------------------------------
  'Using the html5 strategy on a Youtube video': {
    topic: helpers.youtube({strategy: 'html5'}),
    'should not return an error': helpers.noError,
    'should return an iframe': helpers.iframe
  },
  'Using the html5 strategy on a Vimeo video': {
    topic: helpers.vimeo({strategy: 'html5'}),
    'should not return an error': helpers.noError,
    'should return an iframe': helpers.iframe
  },
  'Using the html5 strategy on an mp4 video': {
    topic: helpers.mp4({strategy: 'html5'}),
    'should not return an error': helpers.noError,
    'should return an html5 video': helpers.html5Video,
    'should not have a Flash fallback': helpers.noFlashFallback
  },
  'Using the html5 strategy on an mp3 audio file': {
    topic: helpers.mp3({strategy: 'html5'}),
    'should not return an error': helpers.noError,
    'should return an html5 audio tag': helpers.html5Audio,
    'should not have a Flash fallback': helpers.noFlashFallback
  },
  //--------------------------------------------------------------------------
  'Using the oembed strategy on a Vimeo video': {
    topic: helpers.vimeo({strategy: 'oembed'}),
    'should not return an error': helpers.noError,
    'should not return html': function(err, html) {
      assert.isTrue(typeof 'html' === 'string' && html.length > 0);
    }
  }
}).export(module);
