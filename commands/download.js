const yaml = require('js-yaml')
const fs = require('fs')
const WML = require('./../api/wml')

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  console.log('(Using settings from config.yaml)')
  const modelId = options[0]

  const { region, access_key_id, secret_access_key } = config.credentials.cos
  const cosConfig = {
    endpoint: `https://s3-api.${region}.objectstorage.softlayer.net`,
    accessKeyId: access_key_id,
    secretAccessKey: secret_access_key
  }
  const cos = new COS.S3(cosConfig)
}
