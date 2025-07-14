// import { formatNumeral, formatPriceValue, separateNumber } from "@/lib/number";
import {
  formatNumeral,
  formatPriceValue,
  separateNumber,
} from '@/utils/number';
import clsx from 'clsx';
import { FC } from 'react';

interface IProps {
  value?: number | string | null;
  prefix?: string;
  symbol?: string;
  color?: any;
  default?: string;
  numeral?: string;
  fractionDigits?: number;
  isCalcNumeralFormat?: boolean;
  decimalPlaces?: number;
  isAllowZero?: boolean;
  abbreviate?: boolean;
  loading?: boolean;
  className?: string;
  powClass?: string;
  [key: string]: any;
}

const getValueNumeral = (
  valueFormatted: string,
  isCalcNumeralFormat?: boolean,
  numeral?: string,
  abbreviate?: boolean
) => {
  try {
    const numberValue = Number(valueFormatted);

    if (isNaN(numberValue)) {
      return valueFormatted;
    }
    if (abbreviate) {
      if (numberValue >= 1e9) {
        return formatNumeral(numberValue / 1e9, '0,0.[00]') + 'B'; // billions
      } else if (numberValue >= 1e6) {
        return formatNumeral(numberValue / 1e6, '0,0.[00]') + 'M'; // millions
      } else if (numberValue >= 1e3) {
        return formatNumeral(numberValue / 1e3, '0,0.[00]') + 'K'; // thousands
      }
    }
    if (isCalcNumeralFormat) {
      const zeros = new Array(String(valueFormatted).split('.')[1]?.length || 0)
        .fill('0')
        .join('');
      return formatNumeral(valueFormatted, `0,0.[${zeros || '0000'}]`);
    }

    return formatNumeral(
      valueFormatted,
      numeral ||
        (numberValue > 0 && numberValue < 1 ? '0,0.[0000000]' : '0,0.[00]')
    );
  } catch (error) {
    return valueFormatted;
  }
};
const FormatNumberDecimal: FC<IProps> = (props) => {
  const { loading, ...rest } = props;

  if (loading) {
    return <span>...loading</span>;
  }

  if (!props.value || props.value == '0')
    return (
      <span {...rest}>
        {props.prefix}0 {props.symbol}
      </span>
    );

  // Ensure value is a valid number or string representing a number
  let safeValue = props.value;
  if (typeof safeValue !== 'number' && typeof safeValue !== 'string') {
    safeValue = '0';
  }
  if (typeof safeValue === 'string' && isNaN(Number(safeValue))) {
    safeValue = '0';
  }
  if (typeof safeValue === 'number' && isNaN(safeValue)) {
    safeValue = 0;
  }

  const valueFormatted = formatPriceValue(
    String(safeValue),
    props.decimalPlaces,
    props.fractionDigits
  );

  if (valueFormatted.includes('_')) {
    const [digits, pow, value] = valueFormatted.split('_');
    return (
      <span className="flex gap-x-1 relative" {...rest}>
        {props.prefix}
        <span className="relative">
          <span
            style={{
              // @ts-ignore
              marginRight: `${pow.length * 5}px`,
            }}
          >
            {separateNumber(String(digits), ',')}
          </span>
          <span
            className={clsx(
              'absolute right-[-3px] top-[10px] text-[10px]',
              props.powClass
            )}
          >
            {pow}
          </span>
        </span>
        <span>{Number(value)}</span>
        {props.symbol && <span className="pl-1">{props.symbol}</span>}
      </span>
    );
  }

  return (
    <span className="flex" {...rest}>
      {props.prefix}
      <span>
        {getValueNumeral(
          valueFormatted,
          props.isCalcNumeralFormat,
          props.numeral,
          props.abbreviate
        )}
      </span>
      {props.symbol && <span className="pl-1">{props.symbol}</span>}
    </span>
  );
};

export default FormatNumberDecimal;
