const Expression = require('./calc-money').Expression
const Money = require('./calc-money').Money
const Sum = require('./calc-money').Sum

const Bank = require('./bank')

it('Money::times() should multiply amount by multiplier', () => {
  const five = Money.dollar(5)
  expect(five.times(2).equals(Money.dollar(10))).toBe(true)
  expect(five.times(3).equals(Money.dollar(15))).toBe(true)
})

it('Money:equals() should determine if two Money objects are same by amount and currency', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true)
  expect(Money.dollar(6).equals(Money.dollar(5))).toBe(false)
})

it('Money:equals() should fail when comparing dollar to franc', () => {
  expect(Money.franc(5).equals(Money.dollar(5))).toBe(false)
})

it('Money:dollar() currency should be `$` && Money:franc() should be `₣`', () => {
  expect(Money.dollar(1).currency).toBe('$')
  expect(Money.franc(1).currency).toBe('₣')
})

it('Expression.reduce throw abtract error', () => {
  expect(new Expression().reduce).toThrow('abstract should be overridden')
})

it('testPlusReturnsSum', () => {
  const /* Money */ five = Money.dollar(5)
  const /* Sum */ sum = new Sum(five, five)
  expect(sum.augend).toBe(five)
  expect(sum.addend).toBe(five)
})

it('testBankRate', () => {
  const bank = new Bank()
  bank.addRate('₣', '$', 2)
  const result = bank.rate('₣', '$')
  expect(result).toBe(2)
})

it('testIdentityRate()', () => {
  expect(new Bank().rate('$', '$')).toBe(1)
})

it('testReduceMoney', () => {
  const bank = new Bank()
  const result = bank.reduce(Money.dollar(1), '$')
  expect(result).toStrictEqual(Money.dollar(1))
})

it('testReduceSum', () => {
  const bank = new Bank()
  const sum = new Sum(Money.dollar(3), Money.dollar(4))
  const result = bank.reduce(sum, '$')
  expect(result).toStrictEqual(Money.dollar(7))
})

it('Money:plus() should add amount by addition 5$+5$=10$', () => {
  const bank = new Bank()
  const /* Money */ five = Money.dollar(5)
  const /* Expression */ sum = five.plus(five)
  const /* Money */ reduced = bank.reduce(sum, '$')
  expect(reduced.equals(Money.dollar(10))).toBe(true)
  // const /* Expression */ sum2 = five.plus(Money.dollar(6))
  // const /* Money */ reduced2 = bank.reduced(sum2, '$')
  // expect(reduced2.equals(Money.dollar(11))).toBe(true)
})

it('testReduceMoneyDifferentCurrency', () => {
  const bank = new Bank()
  bank.addRate('₣', '$', 2)
  const result = bank.reduce(Money.franc(2), '$')
  expect(result).toStrictEqual(Money.dollar(1))
})

it('test mixed addition, $5 + 10 CHF = $10 if rate is 2:1', () => {
  const /*Expression*/ fiveBucks = Money.dollar(5)
  const /*Expression*/ tenFrancs = Money.franc(10)
  const /*Bank*/ bank = new Bank()

  bank.addRate('₣', '$', 2)
  const /*Money*/ result = bank.reduce(fiveBucks.plus(tenFrancs), '$')
  expect(result).toStrictEqual(Money.dollar(10))
})

it('testSumPlusMoney', () => {
  const /*Expression*/ fiveBucks = Money.dollar(5)
  const /*Expression*/ tenFrancs = Money.franc(10)
  const /*Bank*/ bank = new Bank()

  bank.addRate('₣', '$', 2)
  const /*Expression*/ sum = new Sum(fiveBucks, tenFrancs).plus(fiveBucks)
  const /*Money*/ result = bank.reduce(sum, '$')
  expect(result).toStrictEqual(Money.dollar(15))
})

it('testSumTimes', () => {
  const /*Expression*/ fiveBucks = Money.dollar(5)
  const /*Expression*/ tenFrancs = Money.franc(10)
  const /*Bank*/ bank = new Bank()

  bank.addRate('₣', '$', 2)
  const /*Expression*/ sum = new Sum(fiveBucks, tenFrancs).times(2)
  const /*Money*/ result = bank.reduce(sum, '$')
  expect(result).toStrictEqual(Money.dollar(20))
})

it.todo('reduce(Bank,String')
it.todo('Money rounding?')

//it.todo('equal null')
//it.todo('equal object')
//it.todo('hashCode()')
//it.todo('equals()')
