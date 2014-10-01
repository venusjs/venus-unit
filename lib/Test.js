'use strict';

var fs              = require('fs');
var path            = require('path');
var Promise         = require('bluebird');
var TestConfig      = require('./TestConfig');
var TestResources   = require('./TestResources');

module.exports = Test;

/**
 * @constructor
 * @param {string} testPath Absolute path to test file on disk
 * @param {number} id Test id
 * @param {VenusUnit} plugin Reference to plugin instance
 */
function Test(testPath, id, plugin) {
  this.fsPath    = testPath;
  this.id        = id;
  this.basePath  = path.dirname(testPath);
  this.config    = new TestConfig(this, plugin);
  this.resources = new TestResources(this, plugin);
}

/**
 * @property {string} fsPath
 * @default null
 */
Test.prototype.fsPath = null;

/**
 * @method load
 */
Test.prototype.load = function () {
  return new Promise(function (resolve) {
    this.resources.test().then(function (src) {
      this.config.annotations.parse(src);
      resolve();
    }.bind(this));
  }.bind(this));
};

/**
 * @method fsStream
 */
Test.prototype.fsStream = function () {
  return fs.createReadStream(this.fsPath);
};

/**
 * Get render context
 */
Test.prototype.ctx = function () {
  return new Promise(function (resolve) {
    Promise.all([
      this.resources.code(),
      this.resources.script(),
      this.resources.html(),
      this.resources.css(),
      this.resources.test()
    ]).then(function (data) {
      var ctx = {
        code: data[0],
        script: data[1],
        html: data[2],
        css: data[3],
        test: data[4]
      };

      resolve(ctx);
    });
  }.bind(this));
};
