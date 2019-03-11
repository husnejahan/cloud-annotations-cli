const request = require('request-promise-native')

class WML {
  constructor({ instance_id, username, password, url }) {
    this._token = undefined
    this._instanceId = instance_id
    this._username = username
    this._password = password
    this._url = url
  }

  async authenticate() {
    return request({
      method: 'GET',
      json: true,
      url: `${this._url}/v3/identity/token`,
      auth: {
        user: this._username,
        pass: this._password
      }
    }).then(body => {
      return body.token
    })
  }

  async createTrainingDefinition(name) {
    if (!this._token) {
      this._token = await this.authenticate()
    }
    const trainingDefinition = {
      name: name,
      framework: {
        name: 'tensorflow',
        version: '1.12',
        runtimes: [
          {
            name: 'python',
            version: '3.5'
          }
        ]
      }
    }
    return request({
      method: 'POST',
      json: true,
      url: `${this._url}/v3/ml_assets/training_definitions`,
      auth: {
        bearer: this._token
      },
      body: trainingDefinition
    })
  }

  async addTrainingScript(trainingDefinition) {
    if (!this._token) {
      this._token = await this.authenticate()
    }
    return request(
      'https://github.com/cloud-annotations/cloud-annotations-sdk/releases/download/v0.0.1-beta/object_detection.zip'
    ).pipe(
      request({
        method: 'PUT',
        json: true,
        url: trainingDefinition.entity.training_definition_version.content_url,
        auth: {
          bearer: this._token
        },
        headers: {
          'content-type': 'application/octet-stream'
        }
      })
    )
  }

  async startTrainingRun(trainingDefinition, config) {
    if (!this._token) {
      this._token = await this.authenticate()
    }
    const connection = {
      endpoint_url: `https://s3-api.${
        config.credentials.cos.region
      }.objectstorage.service.networklayer.com`,
      access_key_id: config.credentials.cos.access_key_id,
      secret_access_key: config.credentials.cos.secret_access_key
    }
    const trainingRun = {
      model_definition: {
        framework: {
          name: trainingDefinition.entity.framework.name,
          version: trainingDefinition.entity.framework.version
        },
        name: config.name,
        author: {},
        definition_href: trainingDefinition.metadata.url,
        execution: {
          command: `python3 -m wml.train_command --num-train-steps=${
            config.trainingParams.steps
          }`,
          compute_configuration: { name: config.trainingParams.gpu }
        }
      },
      training_data_reference: {
        connection: connection,
        source: { bucket: config.buckets.training },
        type: 's3'
      },
      training_results_reference: {
        connection: connection,
        target: { bucket: config.buckets.output || config.buckets.training },
        type: 's3'
      }
    }
    return request({
      method: 'POST',
      json: true,
      url: `${this._url}/v3/models`,
      auth: {
        bearer: this._token
      },
      body: trainingRun
    })
  }
}

module.exports = WML
