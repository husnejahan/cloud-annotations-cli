const yaml = require('js-yaml')
const fs = require('fs')
const WML = require('./../api/wml')

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  console.log('(Using settings from config.yaml)')
  // TODO: Check model status before opening a socket.
  const modelId = options[0]

  const ws = await new WML(config).createMonitorSocket(modelId)
  ws.on('open', function open() {
    console.log(`Monitoring ${modelId}...`)
  })

  ws.on('close', function close() {
    console.log('Log monitor done.')
  })

  ws.on('message', function message(message) {
    const { status } = JSON.parse(message)
    if (status) {
      const { message } = status
      if (message) {
        if (message.length > 0) {
          console.log(message)
        }
      }
    }
  })
}

// key = run_details["entity"]["training_results_reference"]["location"]["model_location"] + '/learner-1/training-log.txt'
//             obj = client_cos.get_object(Bucket=bucket, Key=key)
//             print(obj['Body'].read().decode('utf-8'))
