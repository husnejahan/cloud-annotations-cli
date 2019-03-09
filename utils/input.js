module.exports = prompt =>
  new Promise((resolve, _) => {
    process.stdout.write(prompt)
    process.stdin.resume()

    const onDataListener = function(d) {
      resolve(d.toString().trim())
      process.stdin.removeListener('data', onDataListener)
      process.stdin.pause()
    }
    process.stdin.addListener('data', onDataListener)
  })
