import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import Decimal from 'decimal.js';

const DEFAULT_DECIMALS = 6;
const ten = new BigNumber(10);

export function fromUnits(
  num: number | string,
  decimals: number | string = DEFAULT_DECIMALS
) {
  return BigNumber(num).div(ten.pow(decimals)).toFixed();
}

export const revertFromUnits = (
  num: number | string,
  decimals: number | string = DEFAULT_DECIMALS
) => {
  return BigNumber(num).multipliedBy(ten.pow(decimals)).toFixed();
};

export function formatNumberRoundDown(num: number | string, decimals = 2) {
  return new BigNumber(num).toFormat(decimals, BigNumber.ROUND_DOWN);
}

export const removeLeadingZeros = (
  value: string | number | bigint | BigNumber
) => {
  const strValue = value.toString();
  if (strValue === '0.') {
    return '0.';
  }
  let res = strValue.replace(/^0+(?=\d)/, '').replace(/^0+(\.)/, '0$1');
  if (strValue.endsWith('.')) {
    res += '.';
  }

  if (res === '') {
    res = '0';
  }
  if (res === '.') {
    res = '0.';
  }
  return res;
};

export const removeTrailingZeros = (
  value: string | number | bigint | BigNumber
) => {
  const strValue = value.toString();
  if (strValue.includes('.')) {
    if (strValue.endsWith('.')) {
      return strValue.replace(/(\.\d*?[1-9])?0+$/, '$1');
    }
    return strValue.replace(/(\.\d*?[1-9])?0+$/, '$1').replace(/\.$/, '');
  }
  return strValue;
};

export interface NumberFormatOptions {
  decimals?: number | string;
  prefix?: string;
  suffix?: string;
  trailingZeros?: boolean;
  roundingMode?: BigNumber.RoundingMode;
}

export const formatNumber = (
  value: string | number | bigint | BigNumber,
  {
    decimals = DEFAULT_DECIMALS,
    prefix = '',
    suffix = '',
    trailingZeros = true,
    roundingMode,
  }: NumberFormatOptions = {}
) => {
  if (value === null || value === undefined) return '';

  const bnValue =
    value instanceof BigNumber ? value : new BigNumber(value.toString());
  const numberDecimals =
    typeof decimals === 'string' ? Number(decimals) : decimals;
  const dp = bnValue.dp();
  const formattedValue =
    dp && dp > numberDecimals
      ? `${prefix}${bnValue.toFormat(numberDecimals, roundingMode)}${suffix}`
      : `${prefix}${bnValue.toFormat()}${suffix}`;

  return trailingZeros ? removeTrailingZeros(formattedValue) : formattedValue;
};

export function toUnits(
  src: number | string | bigint | BigNumber,
  decimals: string | number = DEFAULT_DECIMALS
) {
  const strSrc = src.toString();
  return BigNumber(strSrc).multipliedBy(ten.pow(decimals)).toFixed(0);
}

export const tryParseNumber = (value: string) => {
  const cleanedValue = value.replace(/[^0-9.]/g, '');
  if (cleanedValue === '') {
    return 0;
  }

  const parsedValue = Number.parseFloat(cleanedValue);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export function toBigInt(value: number | string | bigint | BigNumber): bigint {
  try {
    return typeof value === 'bigint' ? value : BigInt(value.toString());
  } catch (error) {
    return BigInt(0);
  }
}

// export function fromFemto(value: number | string | bigint | BigNumber) {
// 	return fromUnits(value.toString(), 18)
// }

// export function toFemto(value: number | string | bigint | BigNumber) {
// 	return toUnits(value.toString(), 18)
// }

export function abbreviateNumber(
  value: number | BigNumber,
  decimals: number,
  minDecimals?: number
) {
  const bigNumber = value instanceof BigNumber ? value.toNumber() : value;

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: decimals,
    minimumFractionDigits: minDecimals ?? decimals,
  }).format(bigNumber);
}

export function formatWithSubscript(number: string, decimals?: number) {
  // Special case for zero values
  if (Number(number) === 0) {
    return '0';
  }

  // Remove trailing zeros before processing
  const trimmedNumber = number.replace(/\.?0+$/, '');
  const scientificStr = trimmedNumber.toString();

  // If the number doesn't contain multiple zeros, return as is
  if (!scientificStr.includes('0'.repeat(3))) {
    return decimals !== undefined
      ? new BigNumber(scientificStr).toFixed(decimals)
      : scientificStr;
  }

  // Find consecutive zeros
  const matches = scientificStr.match(/0+/g);
  if (!matches) return scientificStr;

  // Find the longest sequence of zeros
  const longestZeroSequence = matches.reduce((a, b) =>
    a.length > b.length ? a : b
  );

  // Only process if we have at least 3 zeros
  if (longestZeroSequence.length < 3) return scientificStr;

  // Replace the zeros with subscript number
  const subscriptDigits: { [key: string]: string } = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  };

  const zeroCount = longestZeroSequence.length;
  const subscriptNum = zeroCount
    .toString()
    .split('')
    .map((digit) => subscriptDigits[digit])
    .join('');

  // Replace the longest sequence of zeros with the subscript
  const parts = scientificStr.split(longestZeroSequence);

  // Apply decimal places limit if specified
  if (decimals !== undefined) {
    parts[1] = parts[1]?.slice(0, decimals);
  }

  let result = `${parts[0]}0${subscriptNum}${parts[1] || ''}`;

  return result;
}

const numeralType = {
  DEFAULT: '0,0',
  PRICE_NUMBER: '$0,0.00',
  TWO_DECIMAL: '0,0.00',
  TWO_DECIMAL_2: '0,0.[0]a)',
  TWO_DECIMAL_2_WITHSYMBOL: '$0,0.[0]a)',
  VOLUME_NUMBER: '($0,0.[0]a)',
  VOLUME_NUMBER_WITH_2DECIMAL_2: '(0,0.[00]a)',
  VOLUME_NUMBER_WITH_2DECIMAL: '($0,0.[00]a)',
  PRICE_CHANGE: '0,0.00%',
  TOKEN_BALANCE: '0,0.[000]a',
};

export function formatNumeral(
  price: string | number = 0,
  format = numeralType.DEFAULT,
  prefix?: string,
  suffix?: string
): string {
  price = Number(price).toString();
  if (price.includes('e+')) {
    const [value, pow] = price.split('e+');
    return `${prefix || ''}${Math.round(Number(value) * 100) / 100}e+${pow}${
      suffix || ''
    }`;
  }
  return numeral(price).format(format);
}

export const formatPriceValue = (
  numberStr: string,
  decimalPlaces = 5,
  fractionDigits = 3
) => {
  const n = Number(numberStr);
  if (isNaN(n)) return '0';
  numberStr = n.toString();
  if (numberStr.includes('e-')) {
    const [value, pow] = numberStr.split('e-');
    const powDecimal = new Decimal(pow).sub('1');
    const valueDecimal = new Decimal(
      Number(value).toFixed(decimalPlaces).replace('.', '')
    );
    if (powDecimal.greaterThanOrEqualTo(fractionDigits)) {
      return `0.0_${powDecimal}_${valueDecimal
        .toString()
        .slice(0, fractionDigits)}`;
    }
  }
  if (numberStr.startsWith('0.000')) {
    const leadingZeros = countLeadingZeros(numberStr);
    if (leadingZeros >= fractionDigits) {
      const nextDigits = numberStr.slice(leadingZeros + 2, leadingZeros + 6);
      const rounded = Math.round(Number(`0.${nextDigits}`) * 1000)
        .toString()
        .padStart(fractionDigits, '0');
      return `0.0_${leadingZeros}_${rounded}`;
    }
  }
  if (+numberStr > 1) {
    return Number(new Decimal(numberStr).toFixed(fractionDigits)).toString();
  }
  return Number(new Decimal(numberStr).toFixed(decimalPlaces)).toString();
};

const countLeadingZeros = (numStr: string) => {
  const match = numStr.match(/0\.(0+)/);
  return match ? match[1].length : 0;
};

export const separateNumber = (number: string | number, separate = ',') => {
  try {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separate);
  } catch (error) {
    return number;
  }
};
