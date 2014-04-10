'use strict';

var q    = require('q'),
    fs   = require('fs'),
    path = require('path');

module.exports = {
  /**
   * @method content
   */
  content: function (contentPath) {
    var def, fsPath;

    def = q.defer();
    fsPath = this.absPath(contentPath);

    // load content from filesystem
    // resolve deferred with content, or reject with 404
    fs.readFile(fsPath, function (err, data) {
      if (err) {
        def.reject({ status: 404, err: err });
      } else {
        def.resolve(data);
      }
    });

    return def.promise;
  },

  /**
   * @method absPath
   * @param {string} relativePath relative path
   */
  absPath: function (relativePath) {
    return path.resolve(__dirname, '..', 'web_client', relativePath);
  }
};
