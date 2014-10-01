'use strict';

var fs                = require('fs');
var path              = require('path');
var Promise           = require('bluebird');
var concat            = require('concat-stream');
var defaultTransforms = require('./transforms');
var mustache          = require('mustache');

module.exports = TestResources;

/**
 * @constructor
 * @param {Test} test
 * @param {VenusUnit} plugin
 */
function TestResources(test, plugin) {
  this.plugin  = plugin;
  this.venus   = plugin.venus;
  this.testObj = test;
  this.config  = test.config;
}

/**
 * @method sources
 * @param {string} type
 */
TestResources.prototype.source = function (type, defaultTransforms) {
  var sources = this.config.get(type);

  return Promise.all(
    sources.map(function (source) {
      source.defaultTransforms = defaultTransforms;
      return this.loadSource(source);
    }.bind(this))
  );
};

/**
 * @method loadSource
 * @param {object} source
 * @returns {Promise}
 */
TestResources.prototype.loadSource = function (source) {
  var transforms = source.transforms.concat(source.defaultTransforms);

  return new Promise(function (resolve) {
    this
      .applyTransforms(fs.createReadStream(source.path), source.path, transforms)
      .pipe(concat(function (data) {
        resolve(data.toString());
      }));
  }.bind(this));
};

/**
 * Apply transforms
 * @param {stream} stream
 * @param {string} path File path stream was read from
 * @param {array} transforms
 */
TestResources.prototype.applyTransforms = function (stream, path, transforms) {
  transforms.forEach(function (transform) {
    var tfn = this.plugin.transforms[transform] || defaultTransforms[transform];
    var error;

    if (!tfn) {
      error = new Error([
        'Unable to locate transform "',
        transform,
        '", specified in "',
        this.testObj.fsPath,
        '. Did you forget to load a plugin? Check your .venusrc file.'
      ].join(''));

      this.venus.error(error);
      return;
    }

    stream = stream.pipe(tfn(path));
  }, this);

  return stream;
};

/**
 * @method code
 * @returns {Promise}
 */
TestResources.prototype.code = function () {
  return this.source('code', ['insertFilenameJs']);
};

/**
 * @method script
 * @returns {Promise}
 */
TestResources.prototype.script = function () {
  return this.source('script', ['insertFilenameJs']);
};

/**
 * @method html
 * @returns {Promise}
 */
TestResources.prototype.html = function () {
  return this.source('html', ['insertFilenameHtml']);
};

/**
 * @method css
 * @returns {Promise}
 */
TestResources.prototype.css = function () {
  return this.source('css', ['insertFilenameCss']);
};

/**
 * @method test
 * @returns {Promise}
 */
TestResources.prototype.test = function () {
  var transforms;

  transforms = this.config.get('transform') || [];
  transforms = transforms.concat(['insertFilenameJs']);

  return new Promise(function (resolve) {
    this.applyTransforms(this.testObj.fsStream(), this.testObj.fsPath, transforms).pipe(concat(function (data) {
      resolve(data.toString());
    }));
  }.bind(this));
};

/**
 * @method sandboxPage
 * @returns {Promise}
 */
TestResources.prototype.sandboxPage = function () {
  return new Promise(function (resolve) {
    this.testObj.load().then(function () {
      var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'sandbox.tl')).toString();
      this.testObj.ctx().then(function (ctx) {
        resolve(mustache.render(tl, ctx));
      });
    }.bind(this));
  }.bind(this));
};

/**
 * @method harnessPage
 * @returns {Promise}
 */
TestResources.prototype.harnessPage = function () {
  return new Promise(function (resolve) {
    this.testObj.load().then(function () {
      var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'harness.tl')).toString();
      this.testObj.ctx().then(function (ctx) {
        resolve(mustache.render(tl, ctx));
      });
    }.bind(this));
  }.bind(this));
};
