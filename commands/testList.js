const { cyan } = require('chalk')
const picker = require('./../utils/picker')

module.exports = async () => {
  // const items = [
  //   'a',
  //   'b',
  //   'c',
  //   'd',
  //   'e',
  //   'f',
  //   'g',
  //   'h',
  //   'i',
  //   'j',
  //   'k',
  //   'l',
  //   'm',
  //   'n',
  //   'o',
  //   'p',
  //   'q',
  //   'r',
  //   's',
  //   't',
  //   'u',
  //   'v',
  //   'w',
  //   'x',
  //   'y',
  //   'z'
  // ]
  const items = ['oriana', 'is', 'the', 'best', '😍']
  const overrides = {
    windowSize: 11,
    default: 0,
    renderItem: (item, selected) => {
      if (selected) {
        return cyan.bold(`❯ ${item}`)
      }
      return `  ${item}`
    }
  }
  const answer = await picker('Choose a letter:', items, overrides)
  console.log(answer)
}
