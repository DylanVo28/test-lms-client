import BigNumber from 'bignumber.js';

export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);
export const BIG_PROXIMATE_ZERO = new BigNumber(0.0000001);
export const BIG_NINE = new BigNumber(9);
export const BIG_TEN = new BigNumber(10);

export const convertBigNumber18 = (number: string) => {
  return new BigNumber(number).dividedBy(new BigNumber(10).pow(18)).toString();
};

export const getNumberFixed3 = (number: string) => {
  return parseFloat(parseFloat(number).toFixed(3));
};

export const getDecimalAmount = (amount: BigNumber, decimals = 6) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 6) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 6) => {
  const balanceAmount = getBalanceAmount(balance, decimals);
  return balanceAmount.isZero() ? '0' : balanceAmount.toFixed();
};
