'use strict';

var fs              = require('fs');
var path            = require('path');
var Promise         = require('bluebird');
var SpecConfig      = require('./SpecConfig');
var SpecResources   = require('./SpecResources');

module.exports = Spec;

/**
 * @constructor
 * @param {string} specFilePath Absolute path to spec file on disk
 * @param {number} id Spec id
 * @param {VenusUnit} plugin Reference to plugin instance
 */
function Spec(specFilePath, id, plugin) {
  this.fsPath    = specFilePath;
  this.id        = id;
  this.basePath  = path.dirname(specFilePath);
  this.plugin    = plugin;
  this.config    = new SpecConfig(this);
  this.resources = new SpecResources(this);
}

/**
 * @property {string} fsPath
 * @default null
 */
Spec.prototype.fsPath = null;

/**
 * @method load
 */
Spec.prototype.load = function () {
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
Spec.prototype.fsStream = function () {
  return fs.createReadStream(this.fsPath);
};

/**
 * Get render context
 */
Spec.prototype.ctx = function () {
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
