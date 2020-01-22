const Expression = require('./calc-money').Expression

class Bank {
  constructor() {
    this._rates = {} 
  }

  key(/* string */ from, /* string */ to) {
    return `${from}.${to}`
  }

  addRate(/* string */ from, /* string */ to, /* number */ rate) {
    this._rates[this.key(from, to)] = rate;
  }

  /**
   * 
   * @param {Expression} source 
   * @param {string} to 
   */
  reduce(/* Expression */ source, /* string */ to) {
    return source.reduce(this, to)
  }

  rate(/* string */ from, /* string */ to) {
    if (from === to) return 1
    
    return this._rates[this.key(from, to)]
  }
}

module.exports = Bank;