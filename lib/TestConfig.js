'use strict';

var TestAnnotations = require('./TestAnnotations');

module.exports = TestConfig;

/**
 * @constructor
 */
function TestConfig(test, plugin) {
  this.annotations = new TestAnnotations(test.basePath);
  this.configCtx = plugin.config.clone(test.fsPath);
  this.configCtx.addStore({
    provider: 'literal',
    data: this.annotations
  });
}

/**
 * @param {string} key Key to get
 * @returns {any}
 */
TestConfig.prototype.get = function (key) {
  return this.configCtx.get(key);
};

/**
 * @param {string} key Key to get
 * @returns {object}
 */
TestConfig.prototype.getWithMeta = function (key) {
  return this.configCtx.getWithMeta(key);
};