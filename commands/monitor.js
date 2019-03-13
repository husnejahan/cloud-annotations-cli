const WML = require('./../api/wml')
const loadConfig = require('./../utils/loadConfig')

module.exports = async options => {
  const parser = optionsParse()
  parser.add('model_id')
  parser.add([true, 'help', '--help', '-h'])
  const ops = parser.parse(options)

  if (ops.help) {
    console.log('cacli monitor <model_id>')
    process.exit()
  }

  const config = loadConfig()
  console.log('(Using settings from config.yaml)')

  if (!ops.model_id) {
    console.log('No Model ID provided')
    console.log('Usage: cacli monitor <model_id>')
    process.exit(1)
  }

  // TODO: Check model status before opening a socket.

  const ws = await new WML(config).createMonitorSocket(ops.model_id)
  ws.on('open', function open() {
    console.log()
    console.log(`────────────${'─'.repeat(ops.model_id.length)}────────`)
    console.log()
    console.log(`   Monitoring ${ops.model_id}...`)
    console.log()
    console.log(`────────────${'─'.repeat(ops.model_id.length)}────────`)
    console.log()
  })

  ws.on('close', function close() {
    console.log('Log monitor done.')
    console.log()
    console.log(`───────────────────────`)
    console.log()
    console.log('   Log monitor done.')
    console.log()
    console.log(`───────────────────────`)
    console.log()
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
