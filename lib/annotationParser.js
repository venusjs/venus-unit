module.exports = {
  /**
   * @method parse
   * @param {string} data
   */
  parse: function (data) {
    var match, regex, result;

    result = {};
    regex  = /@(venus-)?([\w|-]*)\s*([\w|\/|\\|\*|\.]*)/ig;

    do {
      match = regex.exec(data);
      if (match) {
        this.addMatch(match, result);
      }
    } while (match);

    return result;
  },

  /**
   * @method addMatch
   * @param {array} match from parse regex
   * @param {object} result object
   */
  addMatch: function (match, result) {
    var key = this.camel(match[2].toLowerCase());

    result[key] = result[key] || [];
    result[key].push(match[3]);

  },

  /**
   * Camel case a string
   * @method camel
   * @param {string} input
   */
  camel: function (input) {
    return input.replace(/-(\w)/g, function (match) {
      return match[1].toUpperCase();
    });
  }
};
