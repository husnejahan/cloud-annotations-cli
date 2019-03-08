const p = require('./../paint.js')

// TODO: Make this dynamic
module.exports = options => {
  const title = `C${p.d('loud')} A${p.d('nnotations')} CLI`
  console.log(`┌───────────────────────┐
│ ${title} │
│ version 0.0.1         │
└───────────────────────┘

Usage: cacli <command>

where <command> is one of:
  init         Interactively create a config.yaml file
  train        Start a training run
  monitor      Monitor the progress of a training run (alias: watch)
  stop         Stop a training run
  list         List all training runs
  download     Download a trained model

cacli <cmd> -h     quick help on <cmd>
  `)
}
