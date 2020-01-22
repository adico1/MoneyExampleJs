class Expression {
  reduce(/* Bank */ bank, /* string */ to) {
    throw new Error('abstract should be overridden');
  }

  plus(/* Expression */ addition) {
    throw new Error('abstract should be overridden');
  }

  times(/* number */ multiplier) {
    throw new Error('abstract should be overridden');
  }
}

class Money extends Expression {
  constructor(amount, currency) {
    super()

    this._amount = amount
    this._currency = currency
  }

  equals(someMoney) {
    if (someMoney._currency !== this._currency) {
      return false;
    }

    if (!(someMoney instanceof Money)) {
      return false
    }

    if (someMoney._amount !== this._amount) {
      return false
    }

    return true
  }

  get amount() {
    return this._amount
  }

  get currency() {
    return this._currency;
  }

  /**
   * 
   * @param {number} multiplier
   * @returns {Expression}
   */
  times(multiplier) {
    return new Money(this._amount * multiplier, this._currency)
  }

  /**
   * 
   * @param {Expression} addition
   * @returns {Expression}
   */
  plus(/*Expression*/ addition) {
    return new Sum(this, addition)
  }

  reduce(/* Bank */ bank, /* string */ to) {
    const rate = bank.rate( this._currency, to );
    return new Money(this._amount / rate, to)
  }

  static dollar(amount) {
    return new Money(amount, '$');
  }

  static franc(amount) {
    return new Money(amount, '₣');
  }
}

class Sum extends Expression {
  /**
   * 
   * @param {Expression} augend 
   * @param {Expression} addend 
   */
  constructor(/*Expression*/ augend, /*Expression*/ addend) {
    super()

    this._augend = augend
    this._addend = addend
  }

  get augend() {
    return this._augend
  }

  get addend() {
    return this._addend
  }

  reduce(/* Bank */ bank, /* string */ to) {
    const amount = this._augend.reduce(bank, to).amount + this._addend.reduce(bank, to).amount
    return new Money(amount, to)
  }

  plus(/*Expression*/ addition) {
    return new Sum(this, addition);
  }

  /**
   * 
   * @param {number} multiplier 
   * @returns {Expression}
   */
  times(multiplier) {
    return new Sum(this._augend.times(multiplier), this._addend.times(multiplier))
  }
}

module.exports = { Expression, Money, Sum }