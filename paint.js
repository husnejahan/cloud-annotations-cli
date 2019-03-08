module.exports = (() => ({
  b: string => {
    return `\x1b[1m${string}\x1b[0m`
  },
  d: string => {
    return `\x1b[2m${string}\x1b[0m`
  }
}))()
