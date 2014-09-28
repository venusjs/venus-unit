'use strict';

var fs              = require('fs');
var path            = require('path');
var Promise         = require('bluebird');
var concat          = require('concat-stream');
var TestAnnotations = require('./TestAnnotations');
var TestResources   = require('./TestResources');

module.exports = Test;

/**
 * @constructor
 * @param {string} testPath Absolute path to test file on disk
 * @param {number} id Test id
 */
function Test(testPath, id) {
  this.fsPath    = testPath;
  this.id        = id;
  this.basePath  = path.dirname(testPath);
  this.config    = new TestAnnotations('', this.basePath);
  this.resources = new TestResources(this);
  this.config.test = [{ path: testPath, transforms: [] }];
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
  return new Promise(function (resolve, reject) {
    debugger;
    this.resources.test().then(function (src) {
      this.config.parse(src);
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
 * @method transform
 */
// Test.prototype.source = function () {
  // return new Promise(function (resolve, reject) {
    // this.fsStream().pipe(concat(function (data) {
      // resolve(data.toString());
    // }));
  // }.bind(this));
// };

/**
 * Get render context
 */
Test.prototype.ctx = function () {
  return new Promise(function (resolve, reject) {
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

