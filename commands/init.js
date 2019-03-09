const p = require('../utils/paint.js')
const input = require('../utils/input.js')
const yaml = require('js-yaml')
const fs = require('fs')

// TODO: call object storage.
async function printBuckets() {
  return await input('  1) fake-bucket')
}

const stringToBool = string =>
  string.toLowerCase() === 'y' || string.toLowerCase() === 'yes'

const DEFAULT_URL = 'https://us-south.ml.cloud.ibm.com'
const DEFAULT_REGION = 'us-geo'
const DEFAULT_BUCKET = '<BUCKET_NAME>'
const DEFAULT_USE_OUTPUT = 'yes'
const DEFAULT_GPU = 'k80'
const DEFAULT_STEPS = '500'
const DEFAULT_SAVE = 'yes'

module.exports = async options => {
  const config = {}
  config.name = ''
  config.credentials = {}
  console.log('This utility will walk you through creating a config.yaml file.')
  console.log(
    'It only covers the most common items, and tries to guess sensible defaults.'
  )
  console.log()
  console.log(p.b('Watson Machine Learning Credentials'))
  config.credentials.wml = {}
  config.credentials.wml.instance_id = await input('instance_id: ')
  config.credentials.wml.username = await input('username: ')
  config.credentials.wml.password = await input('password: ')
  config.credentials.wml.url =
    (await input(`url: (${DEFAULT_URL}) `)) || DEFAULT_URL
  console.log()
  console.log(p.b('Cloud Object Storage Credentials'))
  config.credentials.cos = {}
  config.credentials.cos.access_key_id = await input('access_key_id: ')
  config.credentials.cos.secret_access_key = await input('secret_access_key: ')
  config.credentials.cos.region =
    (await input(`region: (${DEFAULT_REGION}) `)) || DEFAULT_REGION
  console.log()
  console.log('loading buckets...')
  await printBuckets()
  config.buckets = {}
  config.buckets.training =
    (await input('training data bucket: ')) || DEFAULT_BUCKET
  console.log()
  const use_output = stringToBool(
    (await input(
      `Would you like to store output in a separate bucket? (${DEFAULT_USE_OUTPUT}) `
    )) || DEFAULT_USE_OUTPUT
  )
  await (async () => {
    if (use_output) {
      config.buckets.output = (await input('output bucket: ')) || DEFAULT_BUCKET
    }
  })()
  console.log()
  console.log(p.b('Training Params'))
  config.trainingParams = {}
  config.trainingParams.gpu =
    (await input(`gpu: (${DEFAULT_GPU}) `)) || DEFAULT_GPU
  config.trainingParams.steps =
    (await input(`steps: (${DEFAULT_STEPS}) `)) || DEFAULT_STEPS
  console.log()
  config.name =
    (await input(`project name: (${config.buckets.training}) `)) ||
    config.buckets.training
  console.log()
  console.log(`About to write to ${process.cwd()}/config.yaml:`)
  console.log()
  const yamlFile = yaml.safeDump(config)
  console.log(yamlFile)
  const save = stringToBool(
    (await input(`Is this ok? (${DEFAULT_SAVE}) `)) || DEFAULT_SAVE
  )
  if (save) {
    fs.writeFile('config.yaml', yamlFile, () => {})
  }
}
