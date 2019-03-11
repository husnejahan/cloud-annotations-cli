const yaml = require('js-yaml')
const fs = require('fs')
const WML = require('./../api/wml')

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  console.log('(Using settings from config.yaml)')
  const trainingRun = WML.trainingRunBuilder(config)
  console.log('Starting training run...')
  const modelId = await trainingRun.start()
  console.log()
  console.log('Model ID:')
  console.log(`┌──${'─'.repeat(modelId.length)}──┐`)
  console.log(`│  ${modelId}  │`)
  console.log(`└──${'─'.repeat(modelId.length)}──┘`)
}
