const yaml = require('js-yaml')
const fs = require('fs-extra')
const WML = require('./../api/wml')
const COS = require('ibm-cos-sdk')

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  console.log('(Using settings from config.yaml)')
  const modelId = options[0]

  const run = await new WML(config).getTrainingRun(modelId)

  const {
    bucket,
    model_location
  } = run.entity.training_results_reference.location

  const { region, access_key_id, secret_access_key } = config.credentials.cos
  const cosConfig = {
    endpoint: `https://s3-api.${region}.objectstorage.softlayer.net`,
    accessKeyId: access_key_id,
    secretAccessKey: secret_access_key
  }
  const cos = new COS.S3(cosConfig)

  const ios = await cos
    .listObjectsV2({ Bucket: bucket, Prefix: `${model_location}/model_ios` })
    .promise()
    .then(data =>
      data.Contents.map(o => o.Key).filter(name => !name.endsWith('/'))
    )
  const web = await cos
    .listObjectsV2({ Bucket: bucket, Prefix: `${model_location}/model_web` })
    .promise()
    .then(data =>
      data.Contents.map(o => o.Key).filter(name => !name.endsWith('/'))
    )
  const android = await cos
    .listObjectsV2({
      Bucket: bucket,
      Prefix: `${model_location}/model_android`
    })
    .promise()
    .then(data =>
      data.Contents.map(o => o.Key).filter(name => !name.endsWith('/'))
    )

  ios.forEach(file => {
    const outputPath = './' + file.replace(`${model_location}/`, '')
    cos
      .getObject({
        Bucket: bucket,
        Key: file
      })
      .promise()
      .then(data => {
        fs.outputFile(outputPath, data.Body)
      })
  })

  web.forEach(file => {
    const outputPath = './' + file.replace(`${model_location}/`, '')
    cos
      .getObject({
        Bucket: bucket,
        Key: file
      })
      .promise()
      .then(data => {
        fs.outputFile(outputPath, data.Body)
      })
  })

  android.forEach(file => {
    const outputPath = './' + file.replace(`${model_location}/`, '')
    cos
      .getObject({
        Bucket: bucket,
        Key: file
      })
      .promise()
      .then(data => {
        fs.outputFile(outputPath, data.Body)
      })
  })
}
