const { dim } = require('chalk')
const yaml = require('js-yaml')
const fs = require('fs')
const WML = require('./../api/wml')
const progress = require('./../commands/progress')
const init = require('./../commands/init')
const input = require('./../utils/input')
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

  const config = await (async () => {
    try {
      const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
      console.log(dim('(Using settings from config.yaml)'))
      return config
    } catch {
      console.log(
        'No config.yaml found, so we will ask you a bunch of questions instead.'
      )
      console.log(
        'Your answers can optionally be saved in a config.yaml file for later use.'
      )
      console.log()
      const config = await init([], true)
      console.log()
      return config
    }
  })()

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
