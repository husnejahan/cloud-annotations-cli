const p = require('./../paint.js')
const input = require('./../input.js')

// TODO: call object storage.
async function printBuckets() {
  return await input('  1) fake-bucket')
}

const DEFAULT_URL = 'https://us-south.ml.cloud.ibm.com'
const DEFAULT_REGION = 'us-geo'
const DEFAULT_BUCKET = '<BUCKET_NAME>'
const DEFAULT_USE_OUTPUT = 'yes'
const DEFAULT_GPU = 'k80'
const DEFAULT_STEPS = '500'
const DEFAULT_SAVE = 'yes'

module.exports = async options => {
  console.log('This utility will walk you through creating a config.yaml file.')
  console.log(
    'It only covers the most common items, and tries to guess sensible defaults.'
  )
  console.log()
  console.log(p.b('Watson Machine Learning Credentials'))
  const instance_id = await input('instance_id: ')
  const username = await input('username: ')
  const password = await input('password: ')
  const url = (await input(`url: (${DEFAULT_URL}) `)) || DEFAULT_URL
  console.log()
  console.log(p.b('Cloud Object Storage Credentials'))
  const access_key_id = await input('access_key_id: ')
  const secret_access_key = await input('secret_access_key: ')
  const region = (await input(`region: (${DEFAULT_REGION}) `)) || DEFAULT_REGION
  console.log()
  console.log('loading buckets...')
  await printBuckets()
  const training_bucket =
    (await input('training data bucket: ')) || DEFAULT_BUCKET
  console.log()
  const use_output =
    (await input(
      `Would you like to store output in a separate bucket? (${DEFAULT_USE_OUTPUT}) `
    )) || DEFAULT_USE_OUTPUT
  console.log()
  console.log(p.b('Training Params'))
  const gpu = (await input(`gpu: (${DEFAULT_GPU}) `)) || DEFAULT_GPU
  const steps = (await input(`steps: (${DEFAULT_STEPS}) `)) || DEFAULT_STEPS
  console.log()
  const name =
    (await input(`project name: (${training_bucket}) `)) || training_bucket
  console.log()
  console.log(`About to write to ${process.cwd()}/config.yaml:`)
  console.log()
  console.log(`name: ${name}`)
  console.log('credentials:')
  console.log('  wml:')
  console.log('    instance_id: ***')
  console.log('    username: ***')
  console.log('    password: ***')
  console.log('    url: ***')
  console.log('  cos:')
  console.log('    access_key_id: ***')
  console.log('    secret_access_key: ***')
  console.log('    region: ***')
  console.log('buckets:')
  console.log(`  training: ${training_bucket}`)
  console.log('trainingParams:')
  console.log(`  gpu: ${gpu}`)
  console.log(`  steps: ${steps}`)
  console.log()
  const save = (await input(`Is this ok? (${DEFAULT_SAVE}) `)) || DEFAULT_SAVE
}
