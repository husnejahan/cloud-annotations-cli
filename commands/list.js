const yaml = require('js-yaml')
const fs = require('fs')
const moment = require('moment')
const WML = require('./../api/wml')
const { fr, fg, d, b } = require('./../utils/paint')
const Table = require('./../utils/table')

module.exports = async options => {
  const config = yaml.safeLoad(fs.readFileSync('config.yaml'))
  console.log('(Using settings from config.yaml)')
  const wml = new WML(config)
  const runs = await wml.listTrainingRuns()

  moment.updateLocale('en', {
    relativeTime: {
      future: '%s',
      past: '%s',
      s: 'just now',
      ss: 'just now',
      m: 'a minute ago',
      mm: '%d minutes ago',
      h: 'an hour ago',
      hh: '%d hours ago',
      d: 'a day ago',
      dd: '%d days ago',
      M: 'a month ago',
      MM: '%d months ago',
      y: 'a year ago',
      yy: '%d years ago'
    }
  })
  const table = new Table({
    columnBuffer: 3,
    width: 90,
    maxWidth: process.stdout.columns
  })
  table.addRow([
    { value: 'name', colorFunc: b },
    { value: 'model id', width: '14', align: 'center', colorFunc: b },
    { value: 'status', width: '11', align: 'center', colorFunc: b },
    { value: 'submitted', width: '14', align: 'right', colorFunc: b }
  ])
  runs.resources
    .sort(
      (a, b) =>
        new Date(a.entity.status.submitted_at) -
        new Date(b.entity.status.submitted_at)
    )
    .forEach(run => {
      const name = run.entity.model_definition.name
      const guid = run.metadata.guid
      const status = run.entity.status.state
      const submitted = moment(run.entity.status.submitted_at).fromNow()

      c = (() => {
        switch (status) {
          case 'completed':
            return { color: fg, lum: x => x }
          case 'error':
            return { color: fr, lum: d }
          default:
            return { color: x => x, lum: x => x }
        }
      })()

      table.addRow([
        { value: name, colorFunc: c.lum },
        { value: guid, width: '14', colorFunc: c.lum },
        { value: status, width: '11', align: 'center', colorFunc: c.color },
        { value: submitted, width: '14', align: 'right', colorFunc: c.lum }
      ])
    })

  console.log(table.toString())
}
// 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789
// --------------------------------------------------------------------------------|
// name                               model id          status            submitted
// tf-object-detection_training-run   model-60sclfap    completed        3 days ago
// pepsi-coke-mountain-dew            model-81nbbdrw    completed       2 hours ago
//                                                                   20 minutes ago
//                                                                      a month ago
//                                                                         just now
