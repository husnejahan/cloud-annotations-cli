const WML = require('./../api/wml')
const progress = require('./../commands/progress')
const input = require('./../utils/input')
const loadConfig = require('./../utils/loadConfig')
const stringToBool = require('./../utils/stringToBool')
const optionsParse = require('./../utils/optionsParse')

module.exports = async options => {
  const parser = optionsParse()
  parser.add([true, 'help', '--help', '-h'])
  const ops = parser.parse(options)

  if (ops.help) {
    console.log('cacli train')
    process.exit()
  }

  const config = loadConfig()

  console.log('Starting training run...')
  const trainingRun = WML.trainingRunBuilder(config)
  const modelId = await trainingRun.start()
  console.log()

  console.log('Model ID:')
  console.log(`┌─${'─'.repeat(modelId.length)}─┐`)
  console.log(`│ ${modelId} │`)
  console.log(`└─${'─'.repeat(modelId.length)}─┘`)
  console.log()

  const shouldMonitor = stringToBool(
    await input(`Would you like to monitor progress? `, 'yes')
  )

  if (shouldMonitor) {
    console.log()
    await progress([modelId], config)
  }
}
