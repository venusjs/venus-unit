'use strict';

var Test     = require('./Test');
var glob     = require('glob');
var path     = require('path');
var fs       = require('fs');
var Promise  = require('bluebird');

module.exports = TestStore;

/**
 * @constructor
 */
function TestStore(venusUnit) {
  var router = venusUnit.router;

  this.venus = venusUnit.venus;
  this.store = {};

  router.addRoute(/^\/test\/sandbox\/(.*)\/?$/i, this.sandboxPage, this);
  router.addRoute(/^\/test\/harness\/(.*)\/?$/i, this.harnessPage, this);
}

/**
 * @method buildTests
 * @param {array} tests
 * @param {string} cwd
 */
TestStore.prototype.init = function (tests, cwd) {
  var id       = 0;

  if (!tests) {
    this.venus.info('No tests specified in config options');
    return;
  }

  glob
    .sync(tests)
    .map(function (file) {
      return path.resolve(cwd, file);
    })
    .forEach(function (path) {
      var testId = id++;
      this.store[testId] = new Test(path, testId);
    }, this);
};

/**
 * Serve test sandbox page
 * @param {number} testId
 */
TestStore.prototype.sandboxPage = function (testId) {
  if (!this.store[testId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid test ID: ' + testId) });
  } else {
    return this.store[testId].resources.sandboxPage();
  }
};

/**
 * Serve test harness page
 * @param {number} testId
 */
TestStore.prototype.harnessPage = function (testId) {
  if (!this.store[testId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid test ID: ' + testId) });
  } else {
    return this.store[testId].resources.harnessPage();
  }
};
