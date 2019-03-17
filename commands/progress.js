const { green } = require('chalk')
const WML = require('./../api/wml')
const loadConfig = require('./../utils/loadConfig')
const optionsParse = require('./../utils/optionsParse')
const ProgressBar = require('./../utils/progressBar')
const Spinner = require('./../utils/spinner')

module.exports = async (options, importedConfig) => {
  const parser = optionsParse()
  parser.add('model_id')
  parser.add([true, 'help', '--help', '-h'])
  const ops = parser.parse(options)

  if (ops.help) {
    console.log('cacli progress <model_id>')
    process.exit()
  }

  const config = importedConfig || loadConfig()

  if (!ops.model_id) {
    console.log('No Model ID provided')
    console.log('Usage: cacli progress <model_id>')
    process.exit(1)
  }

  const wml = new WML(config)

  const run = await wml.getTrainingRun(ops.model_id)

  const status = run.entity.status.state
  switch (status) {
    case 'completed':
    case 'error':
    case 'failed':
    case 'canceled':
      console.log('✨ Done.')
      process.exit()
  }

  const ws = await wml.createMonitorSocket(ops.model_id)
  ws.on('open', function open() {})

  const spinnerModel = new Spinner()
  ws.on('close', function close() {
    spinnerModel.stop()
    console.log(`${green('success')} Model files saved to bucket.`)
    console.log('✨ Done.')
  })

  const spinner = new Spinner()
  spinner.start()
  spinner.setMessage('Preparing to train (this may take a while)... ')

  const totalStepsRegex = /--num-train-steps=(\d*)/gm
  const totalSteps = totalStepsRegex.exec(
    run.entity.model_definition.execution.command
  )[1]
  const progressBar = new ProgressBar(totalSteps)

  let trainingStarted = false
  ws.on('message', function message(message) {
    const { status } = JSON.parse(message)
    if (status) {
      const { message } = status
      if (message) {
        if (message.length > 0) {
          const stepRegex = /tensorflow:loss = [\d.]*, step = (\d*)/gm
          let m
          const matches = []
          while ((m = stepRegex.exec(message)) !== null) {
            if (m.index === stepRegex.lastIndex) {
              stepRegex.lastIndex++
            }
            m.forEach((match, groupIndex) => {
              if (groupIndex === 1) {
                matches.push(match)
              }
            })
          }

          const rateRegex = /tensorflow:global_step\/sec: ([\d.]*)/gm
          while ((m = rateRegex.exec(message)) !== null) {
            if (m.index === rateRegex.lastIndex) {
              rateRegex.lastIndex++
            }
            m.forEach((match, groupIndex) => {
              if (groupIndex === 1) {
                progressBar.applyRateInfo(match)
              }
            })
          }

          const successRegex = /training success/gm
          m = successRegex.exec(message)
          if (m && m[0]) {
            progressBar.stop()
            console.log(`${green('success')} Training complete.`)
            spinnerModel.start()
            spinnerModel.setMessage('Generating model files... ')
          }

          if (matches.length > 0) {
            spinner.stop()
            if (!trainingStarted) {
              trainingStarted = true
              console.log(`${green('success')} Training in progress.`)
            }
            const maxStep = Math.max(matches)
            progressBar.update(maxStep)
          }
        }
      }
    }
  })
}
