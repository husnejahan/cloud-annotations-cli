const yaml = require('js-yaml')
const fs = require('fs')
const WML = require('./../api/wml')
const monitor = require('./../commands/monitor.js')
const input = require('./../utils/input.js')

const stringToBool = string =>
  string.toLowerCase() === 'y' || string.toLowerCase() === 'yes'

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  console.log('(Using settings from config.yaml)')
  const trainingRun = WML.trainingRunBuilder(config)
  console.log('Starting training run...')
  const modelId = await trainingRun.start()
  console.log()
  console.log('Model ID:')
  console.log(`┌─${'─'.repeat(modelId.length)}─┐`)
  console.log(`│ ${modelId} │`)
  console.log(`└─${'─'.repeat(modelId.length)}─┘`)
  console.log()
  const shouldMonitor = stringToBool(
    await input(`Would you like to monitor this training run? `, 'yes')
  )
  if (shouldMonitor) {
    await monitor([modelId])
  }
}
