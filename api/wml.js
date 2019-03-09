const request = require('request-promise-native')
// const STEPS = 50
// const GPU = 'v100x2'
// const TRAINING_BUCKET = 'pepsi-coke-mountain-dew'
// const OUTPUT_BUCKET = 'soda-output-dir'

// const TRAINING_DEFINITION = {
//   name: 'tf-object-detection',
//   framework: {
//     name: 'tensorflow',
//     version: '1.12',
//     runtimes: [
//       {
//         name: 'python',
//         version: '3.5'
//       }
//     ]
//   },
//   command: `python3 -m wml.train_command --num-train-steps=${STEPS}`
// }

// const TRAINING_RUN = {
//   model_definition: {
//     framework: {
//       name: TRAINING_DEFINITION.framework.name,
//       version: TRAINING_DEFINITION.framework.version
//     },
//     name: 'tf-object-detection_training-run',
//     author: {},
//     definition_href:
//       'https://us-south.ml.cloud.ibm.com/v3/ml_assets/training_definitions/2a2241a9-ccc2-415d-a92e-dfeb0594278d',
//     execution: {
//       command: TRAINING_DEFINITION.command,
//       compute_configuration: { name: GPU }
//     }
//   },
//   training_data_reference: {
//     connection: {
//       endpoint_url: COS_URL,
//       access_key_id: COS_ACCESS_KEY_ID,
//       secret_access_key: COS_SECRET_ACCESS_KEY
//     },
//     source: { bucket: TRAINING_BUCKET },
//     type: 's3'
//   },
//   training_results_reference: {
//     connection: {
//       endpoint_url: COS_URL,
//       access_key_id: COS_ACCESS_KEY_ID,
//       secret_access_key: COS_SECRET_ACCESS_KEY
//     },
//     target: { bucket: OUTPUT_BUCKET },
//     type: 's3'
//   }
// }

// module.exports = () => {
//   let TOKEN = ''

//   request({
//     method: 'GET',
//     json: true,
//     url: `${ML_URL}/v3/identity/token`,
//     auth: {
//       user: ML_USERNAME,
//       pass: ML_PASSWORD
//     }
//   })
//     .then(body => {
//       TOKEN = body.token
//       return request({
//         method: 'POST',
//         json: true,
//         url: `${ML_URL}/v3/ml_assets/training_definitions`,
//         auth: {
//           bearer: TOKEN
//         },
//         body: TRAINING_DEFINITION
//       })
//     })
//     .then(body => {
//       TRAINING_RUN.model_definition.definition_href = body.metadata.url
//       return request(
//         'https://github.com/cloud-annotations/cloud-annotations-sdk/releases/download/v0.0.1-beta/object_detection.zip'
//       ).pipe(
//         request({
//           method: 'PUT',
//           json: true,
//           url: body.entity.training_definition_version.content_url,
//           auth: {
//             bearer: TOKEN
//           },
//           headers: {
//             'content-type': 'application/octet-stream'
//           }
//         })
//       )
//     })
//     .then(() => {
//       return request({
//         method: 'POST',
//         json: true,
//         url: `${ML_URL}/v3/models`,
//         auth: {
//           bearer: TOKEN
//         },
//         body: TRAINING_RUN
//       })
//     })
//     .then(() => {
//       console.log('done')
//     })
// }
