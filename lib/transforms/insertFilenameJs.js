module.exports = function (data, source) {
  return [
    '\n',
    '// source: ',
    source.path,
    '\n',
    data
  ].join('');
};
