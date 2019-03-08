const p = require('./../paint.js')
const input = require('./../input.js')

// TODO: call object storage.
async function printBuckets() {
  return await input('  1) fake-bucket')
}

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
  const url = await input('url: (https://us-south.ml.cloud.ibm.com) ')
  console.log()
  console.log(p.b('Cloud Object Storage Credentials'))
  const access_key_id = await input('access_key_id: ')
  const secret_access_key = await input('secret_access_key: ')
  const region = await input('region: (us-geo) ')
  console.log()
  console.log('loading buckets...')
  await printBuckets()
  const training_bucket = await input('training data bucket: ')
  console.log()
  const use_output = await input(
    'Would you like to store output in a separate bucket? (yes) '
  )
  console.log()
  console.log(p.b('Training Params'))
  const gpu = await input('gpu: (k80) ')
  const steps = await input('steps: (500) ')
  console.log()
  const name = await input(`project name: (${training_bucket}) `)
  console.log()
}
