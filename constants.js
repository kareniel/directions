var fs = require('fs')

module.exports = load()

function load () {
  var dict = fs.readFileSync('./env', 'utf8')
    .split('\n')
    .map(pair => pair.split('='))
    .reduce((dict, tuple) => {
      dict[tuple[0]] = tuple[1]
      return dict
    }, {})

  return dict
}
