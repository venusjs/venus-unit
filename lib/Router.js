'use strict';

var q             = require('q'),
    staticContent = require('./staticContent');

module.exports = Router;

function Router() {
  this.routes = [];

  this.addRoute(/^\/web_client\/(.*)/i, staticContent.content, staticContent);
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
  var matchedRoute, params, def;

  def = q.defer();

  this.routes.some(function (route) {
    var match = path.match(route.re);

    if (match) {
      matchedRoute = route;
      params       = match.slice(1);
      return true;
    }
  }, this);

  if (matchedRoute) {
    return matchedRoute.fn.apply(matchedRoute.ctx, params);
  } else {
    def.reject({ status: 404 });
    return def.promise;
  }
};

/**
 * @method onHttpRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
Router.prototype.onHttpRequest = function (request, response) {
  var timeout = setTimeout(function () {
    response.end('Request timed out');
  }, 5000);

  this.route(request.path).then(function (content) {
    clearTimeout(timeout);
    response.end(content);
  }, function (err) {
    clearTimeout(timeout);
    response.statusCode = err.status || 500;
    response.end();
  });
};
