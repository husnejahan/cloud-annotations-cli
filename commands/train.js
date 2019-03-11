const yaml = require('js-yaml')
const fs = require('fs')
const WML = require('./../api/wml')

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  const wml = new WML(config.credentials.wml)
  const trainingDefinition = await wml.createTrainingDefinition(config.name)
  await wml.addTrainingScript(trainingDefinition)
  await wml.startTrainingRun(trainingDefinition, config)
}
