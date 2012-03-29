/**
 * Play media on all devices!
 *
 * Example:
 *
 *   mediaFactory.resolve(myVideoObject).toHtml(function(err, html) {
 *     // do something with html
 *     document.write(html);
 *   });
 */

(function(exports) {

  /**
   * Copies properties from an object to another.
   *
   * @param {Object} the object where properties get copied to
   * @param {Object} the object where properties get copied from
   * @returns {Object} the object where properties get copied to
   */
  var extend = function(to, from) {
    for(var p in from) {
      if(from.hasOwnProperty(p)) {
        to[p] = from[p];
      }
    }

    return to;
  };

  //--------------------------------------------------------------------------

  /**
   * A builder produces HTML from a hash of options.
   * @class
   */

  /**
   * @constructor
   * @param {Object} options needed to render HTML
   */
  var Builder = function(options) {
    if(typeof this.initialize === 'function') {
      this.initialize(options);
    } else {
      Builder.prototype.initialize.call(this, options);
    }
  };

  /**
   * Creates a new class that extends Builder.
   *
   * @static
   * @param {Object} class properties
   * @returns {Function} the new class
   */
  Builder.extend = function(properties) {
    var Class = function(options) {
      Builder.call(this, options);
    };

    extend(Class.prototype, properties);
    return Class;
  };

  extend(Builder.prototype, {
    /**
     * Initilizes the builder.
     *
     * @param {Object} a hash of options
     */
    initialize: function(options) {

    },
    /**
     * Renders HTML.
     *
     * @param {Function} a callback of the form cb(err, html)
     */
    toHtml: function(cb) {
      if(typeof cb === 'function') cb(null, '');
    }
  });

  //--------------------------------------------------------------------------

  /**
   * A builder that produces an HTML5 video.
   *
   * @extends Builder
   */
  var Html5Builder = Builder.extend({
    /**
     * Options:
     *
     *   - sources: an array of videos sources
     *   - [poster]: a placeholder image
     *   - width: the width of the video player
     *   - height: the height of the video player
     *
     * @inherits Builder
     */
    initialize: function(options) {
      this.sources = options.sources;
      this.poster = options.poster || '';
      this.width = options.width || 500;
      this.height = options.height || 281;
    },
    /**
     * @inherits Builder
     */
    toHtml: function(cb) {
      var html = '';
      if(this.poster) {
        html += '<video width="' + this.width + '" height="' + this.height +
                '" poster="' + this.poster + '" controls>';
      } else {
        html += '<video width="' + this.width + '" height="' + this.height +
                '" controls>';
      }

      for(var i = 0; i < this.sources.length; i++) {
        html += '<source src="' + this.sources[i] + '" />';
      }

      html += '</video>';

      if(typeof cb === 'function') cb(null, html);
    }
  });

  //--------------------------------------------------------------------------

  /**
   * A builder that produces an HTML5 video with a Flash fallback.
   *
   * @extends Builder
   */
  var VideoJSBuilder = Builder.extend({
    /**
     * Options:
     *
     *   - sources: an array of videos sources
     *   - [poster]: a placeholder image
     *   - width: the width of the video player
     *   - height: the height of the video player
     *
     * @inherits Builder
     */
    initialize: function(options) {
      this.sources = options.sources;
      this.poster = options.poster || '';
      this.width = options.width || 500;
      this.height = options.height || 281;
    },
    /**
     * Loads a polyfill for HTML5 videos from <http://videojs.com/>.
     *
     * @function
     */
    addPolyFill: function() {
      var _body = document.getElementsByTagName('body')[0];
      var _link = document.createElement('link');
      var _script = document.createElement('script');

      _link.setAttribute('href', 'http://vjs.zencdn.net/c/video-js.css');
      _link.setAttribute('rel', 'stylesheet');
      _script.setAttribute('src', 'http://vjs.zencdn.net/c/video.js');

      _body.appendChild(_link);
      _body.appendChild(_script);
    },
    /**
     * @inherits Builder
     */
    toHtml: function(cb) {
      var html = '';

      if(this.poster) {
        html += '<video width="' + this.width + '" height="' + this.height +
                '" poster="' + this.poster + '" controls' +
                ' class="video-js vjs-default-skin" data-setup="{}">';
      } else {
        html += '<video width="' + this.width + '" height="' + this.height +
                '" controls class="video-js vjs-default-skin"' +
                ' data-setup="{}">';
      }

      // TODO detect video types !!!!!!!!!!!
      for(var i = 0; i < this.sources.length; i++) {
        html += '<source src="' + this.sources[i] + '"  type="video/mp4" />';
      }

      html += '</video>';

      // Load polyfill if needed.
      if(typeof window !== 'undefined' &&
         typeof window.VideoJS === 'undefined') {
        this.addPolyFill();
      }

      if(typeof cb === 'function') cb(null, html);
    }
  });

  //--------------------------------------------------------------------------

  /**
   * A builder that produces embeds a player in an iframe.
   *
   * @extends Builder
   */
  var IFrameBuilder = Builder.extend({
    /**
     * Options:
     *
     *   - url: the url of the embedded content
     *   - width: the width of the video player
     *   - height: the height of the video player
     *
     * @inherits Builder
     */
    initialize: function(options) {
      this.url = options.url;
      this.width = options.width || 500;
      this.height = options.height || 281;
    },
    toHtml: function(cb) {
      var html = '<iframe src="' + this.url + '" width="' + this.width +
                 '" height="' + this.height + '" frameborder="0"></iframe>';

      if(typeof cb === 'function') cb(null, html);
    }
  });

  //--------------------------------------------------------------------------

  var VoidBuilder = Builder.extend({
    /**
     * @inherits Builder
     */
    toHtml: function(cb) {
      if(typeof cb === 'function') {
        cb(new Error('Unknown media type.'), 'Unknown media type.');
      }
    }
  });

  //--------------------------------------------------------------------------

  /**
   * A stategy that decides which builder to load.
   *
   * @class
   */
  var Strategy = function() {

  };

  extend(Strategy.prototype, {
    /**
     * Returns the best builder, or null.
     *
     * @param {Object} a media object
     * @param {Object} a hash of options
     * @returns {Builder} a builder
     */
    execute: function(mediaObject, options) {
      return new VoidBuilder(options);
    }
  });


  /**
   * Creates a new class that extends Strategy.
   *
   * @static
   * @param {Object} class properties
   * @returns {Function} the new class
   */
  Strategy.extend = function(properties) {
    var Class = function(options) {
      Builder.call(this, options);
    };

    extend(Class.prototype, properties);
    return Class;
  };

  //--------------------------------------------------------------------------

  /**
   * The default strategy.
   *
   * @extends Strategy
   */
  var DefaultStrategy = Builder.extend({
    /**
     * @inherits Builder
     */
    execute: function(mediaObject, options) {
      var builder;

      if(mediaObject['@type'] === 'VideoObject') {
        if(mediaObject.embedURL) {
          extend(options, {
            url: mediaObject.embedURL
          });

          builder = new IFrameBuilder(options);
        } else if (mediaObject.contentURL) {
          extend(options, {
            sources: [mediaObject.contentURL]
          });

          builder = new VideoJSBuilder(options);
        }
      }

      return builder || new VoidBuilder();
    }
  });

  //--------------------------------------------------------------------------

  /**
   * A stragegy for HTML5 friendly browsers.
   *
   * @extends Strategy
   */
  var Html5Strategy = Builder.extend({
    /**
     * @inherits Builder
     */
    execute: function(mediaObject, options) {
      var builder;

      if(mediaObject['@type'] === 'VideoObject') {
        if(mediaObject.embedURL) {
          extend(options, {
            url: mediaObject.embedURL
          });

          builder = new IFrameBuilder(options);
        } else if (mediaObject.contentURL) {
          extend(options, {
            sources: [mediaObject.contentURL]
          });

          builder = new Html5Builder(options);
        }
      }

      return builder;
    }
  });

  //--------------------------------------------------------------------------

  /**
   * A factory that returns media builders from a media object.
   *
   * @class
   */
  var MediaFactory = function() {
    this.strategies = {
      def: new DefaultStrategy(),
      html5: new Html5Strategy()
    };
  };

  // TODO: add strategies

  extend(MediaFactory.prototype, {
    /**
     * Returns a media builder from a media object and a hash of options.
     *
     * @param {Object} a media object
     * @param {Object} a hash of options
     * @returns {Builder} a builder
     */
    resolve: function(mediaObject, options) {
      options = options || {};

      var builder;

      if(typeof options.strategy !== 'undefined' &&
         typeof this.strategies[options.strategy] !== 'undefined') {
        var strategy = this.strategies[options.strategy];
        builder = strategy.execute(mediaObject, options);
      }

      return builder || this.strategies.def.execute(mediaObject, options);
    }
  });

  //--------------------------------------------------------------------------

  exports.mediaFactory = new MediaFactory();

})(typeof module !== 'undefined' ? module.exports : window);