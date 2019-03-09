const yaml = require('js-yaml')
const fs = require('fs')

module.exports = options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  wml.authentic()
}
