module.exports = (prompt, defaultVal) =>
  new Promise((resolve, _) => {
    process.stdout.write(prompt)
    if (defaultVal) {
      process.stdout.write(`(${defaultVal}) `)
    }
    process.stdin.resume()

    const onDataListener = function(d) {
      resolve(d.toString().trim() || defaultVal || '')
      process.stdin.removeListener('data', onDataListener)
      process.stdin.pause()
    }
    process.stdin.addListener('data', onDataListener)
  })
