// TODO: Detect if the terminal supports colors.
module.exports = (() => ({
  b: string => {
    return `\x1b[1m${string}\x1b[0m`
  },
  d: string => {
    return `\x1b[2m${string}\x1b[0m`
  },
  br: string => {
    return `\x1b[41m${string}\x1b[0m`
  },
  bg: string => {
    return `\x1b[42m${string}\x1b[0m`
  },
  bc: string => {
    return `\x1b[46m${string}\x1b[0m`
  },
  fr: string => {
    return `\x1b[31m${string}\x1b[0m`
  },
  fg: string => {
    return `\x1b[32m${string}\x1b[0m`
  }
}))()
