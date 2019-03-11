stringLength = input => {
  const ansi = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
  ].join('|')

  const astral = '[\uD800-\uDBFF][\uDC00-\uDFFF]'

  return input
    .replace(new RegExp(ansi, 'g'), '')
    .replace(new RegExp(astral, 'g'), ' ').length
}

module.exports = class Table {
  constructor({ columnBuffer, width, maxWidth }) {
    this._columnBuffer = columnBuffer
    this._width = Math.min(width, maxWidth)
    this._table = ''
  }

  addRow(row) {
    this._table += ' '
    const flexColumns = row.filter(({ width }) => !width)

    const sparePadding = row.reduce((acc, column, i) => {
      const { value, width } = column
      if (width) {
        acc -= width
      } else {
        acc -= stringLength(value)
      }
      if (i < row.length - 1) {
        acc -= this._columnBuffer
      }
      return acc
    }, this._width - 2)

    row.forEach((column, i) => {
      const { value, width, align } = column
      if (!column.colorFunc) {
        column.colorFunc = input => input
      }
      const pad = (() => {
        if (width) {
          return width - stringLength(value)
        } else {
          return sparePadding / flexColumns.length
        }
      })()
      switch (align) {
        case 'right':
          this._table += column.colorFunc(`${' '.repeat(pad)}${value}`)
          break
        case 'center':
          const half = pad / 2
          const mod = pad % 2
          this._table += column.colorFunc(
            `${' '.repeat(half)}${value}${' '.repeat(half + mod)}`
          )
          break
        default:
          this._table += column.colorFunc(`${value}${' '.repeat(pad)}`)
          break
      }
      if (i < row.length - 1) {
        this._table += ' '.repeat(this._columnBuffer)
      }
    })
    this._table += '\n'
  }

  toString() {
    return `${'─'.repeat(this._width)}\n${this._table}${'─'.repeat(
      this._width
    )}`
  }
}