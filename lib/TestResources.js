'use strict';

var fs                = require('fs');
var path                = require('path');
var Promise           = require('bluebird');
var concat            = require('concat-stream');
var defaultTransforms = require('./transforms');
var mustache          = require('mustache');

module.exports = TestResources;

/**
 * @constructor
 * @param {Test} test
 */
function TestResources(test) {
  this.testObj = test;
  this.config  = test.config;
}

/**
 * @method sources
 * @param {string} type
 */
TestResources.prototype.source = function (type, defaultTransforms) {
  var sources = this.config[type];

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
  return new Promise(function (resolve, reject) {
    fs.createReadStream(source.path).pipe(concat(function (data) {
      resolve(this.applyTransforms(data.toString(), source));
    }.bind(this)));
  }.bind(this));
};

/**
 * Apply transforms
 */
TestResources.prototype.applyTransforms = function (data, source) {
  return source.defaultTransforms.reduce(function (val, transform) {
    transform = defaultTransforms[transform] || defaultTransforms.noop;
    return transform(val, source);
  }.bind(this), data);
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
  return this.source('test', ['insertFilenameJs']);
};

/**
 * @method sandboxPage
 * @returns {Promise}
 */
TestResources.prototype.sandboxPage = function () {
  return new Promise(function (resolve, reject) {
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
  return new Promise(function (resolve, reject) {
    this.testObj.load().then(function () {
      var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'harness.tl')).toString();
      this.testObj.ctx().then(function (ctx) {
        resolve(mustache.render(tl, ctx));
      });
    }.bind(this));
  }.bind(this));
};