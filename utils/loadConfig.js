const yaml = require('js-yaml')
const fs = require('fs')

module.exports = () => {
  try {
    return yaml.safeLoad(fs.readFileSync('config.yaml'))
  } catch {
    console.log(
      'No config.yaml found, try running `cacli init` to generate one.'
    )
    process.exit(1)
  }
}
