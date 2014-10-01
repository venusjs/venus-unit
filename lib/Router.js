'use strict';

var Promise       = require('bluebird'),
    staticContent = require('./staticContent');

module.exports = Router;

function Router(plugin) {
  this.venus  = plugin.venus;
  this.routes = [];

  this.addRoute(/^\/static\/(.*)/i, staticContent.content, staticContent);
}

/**
 * @method addRoute
 * @param {RegExp} re
 * @param {function} fn
 * @param {object} ctx
 */
Router.prototype.addRoute = function (re, fn, ctx) {
  this.routes.push({
    re  : re,
    fn  : fn,
    ctx : ctx
  });
};

/**
 * @method route
 */
Router.prototype.route = function (path) {
  var matchedRoute, params;

  return new Promise(function (resolve, reject) {
    this.routes.some(function (route) {
      var match = path.match(route.re);

      if (match) {
        matchedRoute = route;
        params       = match.slice(1);
        return true;
      }
    }, this);

    if (matchedRoute) {
      matchedRoute.fn.apply(matchedRoute.ctx, params).then(resolve, reject);
    } else {
      reject({ status: 404, err: new Error('No matching route') });
    }
  }.bind(this));
};

/**
 * @method onHttpRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
Router.prototype.onHttpRequest = function (request, response) {
  var timeout = setTimeout(function () {
    response.statusCode = 500;
    response.end('Request timed out');
  }, 5000);

  this.route(request.path).then(function (content) {
    clearTimeout(timeout);
    response.end(content);
  }, function (err) {
    var stack = err.stack || err.err.stack;
    var msg   = err.message || err.err.message;

    this.venus.error(stack);

    clearTimeout(timeout);
    response.statusCode = err.status || 500;
    response.end(msg);
  }.bind(this));
};
