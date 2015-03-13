'use strict';

var Test     = require('./Test');
var mustache = require('mustache');
var glob     = require('glob');
var path     = require('path');
var fs       = require('fs');
var Promise  = require('bluebird');

module.exports = TestStore;

/**
 * @constructor
 * @param {VenusUnit} plugin
 */
function TestStore(plugin) {
  var router = plugin.router;

  this.plugin = plugin;
  this.venus  = plugin.venus;
  this.store  = {};

  router.addRoute(/^\/test\/sandbox\/(.*)\/?$/i, this.sandboxPage, this);
  router.addRoute(/^\/test\/harness\/(.*)\/?$/i, this.harnessPage, this);
  router.addRoute(/^\/test\/store\/?$/i, this.storePage, this);
  router.addRoute(/^\/?$/i, this.storePage, this);
}

/**
 * @method buildTests
 * @param {array} tests
 * @param {string} cwd
 */
TestStore.prototype.init = function (tests, cwd) {
  var id = 0;

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
      this.store[testId] = new Test(path, testId, this.plugin);
    }, this);
};

/**
 * Serve store page (list all loaded tests)
 */
TestStore.prototype.storePage = function () {
  var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'store.tl')).toString();
  var tests = Object.keys(this.store).map(function (key) {
    return this.store[key];
  }, this);

  return Promise.resolve(mustache.render(tl, { tests: tests }));
};

/**
 * Serve test sandbox page. The sandbox page is the execution environment
 * for a single test suite.
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
