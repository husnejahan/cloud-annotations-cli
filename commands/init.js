const { bold } = require('chalk')
const input = require('./../utils/input.js')
const yaml = require('js-yaml')
const fs = require('fs')
const COS = require('ibm-cos-sdk')
const stringToBool = require('./../utils/stringToBool.js')

async function printBuckets({ region, access_key_id, secret_access_key }) {
  const config = {
    endpoint: `https://s3-api.${region}.objectstorage.softlayer.net`,
    accessKeyId: access_key_id,
    secretAccessKey: secret_access_key
  }
  const cos = new COS.S3(config)
  return await cos
    .listBuckets()
    .promise()
    .then(data =>
      data.Buckets.map((bucket, i) => {
        console.log(`  ${i + 1}) ${bucket.Name}`)
        return bucket.Name
      })
    )
    .catch(e => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`)
    })
}

const sanitize = (choice, buckets) => {
  if (isNaN(choice) || +choice <= 0 || +choice > buckets.length) {
    return choice
  } else {
    return buckets[+choice - 1]
  }
}

const safeGet = (fn, defaultVal) => {
  try {
    return fn()
  } catch (e) {
    return defaultVal
  }
}

const DEFAULT_URL = 'https://us-south.ml.cloud.ibm.com'
const DEFAULT_REGION = 'us-geo'
const DEFAULT_BUCKET = '<BUCKET_NAME>'
const DEFAULT_USE_OUTPUT = 'yes'
const DEFAULT_GPU = 'k80'
const DEFAULT_STEPS = '500'
const DEFAULT_SAVE = 'yes'

module.exports = async options => {
  const parser = optionsParse()
  parser.add([true, 'help', '--help', '-h'])
  const ops = parser.parse(options)

  if (ops.help) {
    console.log('cacli init')
    process.exit()
  }

  const old = (() => {
    try {
      return yaml.safeLoad(fs.readFileSync('config.yaml'))
    } catch {}
  })()
  const config = {}
  config.name = ''
  config.credentials = {}
  config.credentials.wml = {}
  config.credentials.cos = {}
  config.buckets = {}
  config.trainingParams = {}
  console.log('This utility will walk you through creating a config.yaml file.')
  console.log(
    'It only covers the most common items, and tries to guess sensible defaults.'
  )
  console.log()

  // Watson Machine Learning Credentials
  console.log(bold('Watson Machine Learning Credentials'))
  const instance_id = safeGet(() => old.credentials.wml.instance_id)
  config.credentials.wml.instance_id = await input('instance_id: ', instance_id)
  const username = safeGet(() => old.credentials.wml.username)
  config.credentials.wml.username = await input('username: ', username)
  const password = safeGet(() => old.credentials.wml.password)
  config.credentials.wml.password = await input('password: ', password)
  const url = safeGet(() => old.credentials.wml.url, DEFAULT_URL)
  config.credentials.wml.url = await input(`url: `, url)
  console.log()

  // Cloud Object Storage Credentials
  console.log(bold('Cloud Object Storage Credentials'))
  const access_key_id = safeGet(() => old.credentials.cos.access_key_id)
  config.credentials.cos.access_key_id = await input(
    'access_key_id: ',
    access_key_id
  )
  const secret_access_key = safeGet(() => old.credentials.cos.secret_access_key)
  config.credentials.cos.secret_access_key = await input(
    'secret_access_key: ',
    secret_access_key
  )
  const region = safeGet(() => old.credentials.cos.region, DEFAULT_REGION)
  config.credentials.cos.region = await input(`region: `, region)
  console.log()

  // Buckets
  console.log('loading buckets...')
  const buckets = await printBuckets(config.credentials.cos)
  const training = safeGet(() => old.buckets.training)
  const rawTraining = await input('training data bucket: ', training)
  config.buckets.training = sanitize(rawTraining, buckets) || DEFAULT_BUCKET
  console.log()
  const use_output = stringToBool(
    await input(
      `Would you like to store output in a separate bucket? `,
      DEFAULT_USE_OUTPUT
    )
  )
  await (async () => {
    if (use_output) {
      console.log()
      const output = safeGet(() => old.buckets.output)
      const rawOutput = await input('output bucket: ', output)
      config.buckets.output = sanitize(rawOutput, buckets) || DEFAULT_BUCKET
    }
  })()
  console.log()

  // Training Params
  console.log(bold('Training Params'))
  const gpu = safeGet(() => old.trainingParams.gpu, DEFAULT_GPU)
  config.trainingParams.gpu = await input(`gpu: `, gpu)
  const steps = safeGet(() => old.trainingParams.steps, DEFAULT_STEPS)
  config.trainingParams.steps = await input(`steps: `, steps)
  console.log()

  // Write to yaml
  config.name = await input(`project name: `, config.buckets.training)
  console.log()
  console.log(`About to write to ${process.cwd()}/config.yaml:`)
  console.log()
  const yamlFile = yaml.safeDump(config)
  console.log(yamlFile)
  const save = stringToBool(await input(`Is this ok? `, DEFAULT_SAVE))
  if (save) {
    fs.writeFile('config.yaml', yamlFile, () => {})
  }
}
