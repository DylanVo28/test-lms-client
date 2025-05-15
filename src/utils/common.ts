import { BigNumber } from '@ethersproject/bignumber';

export const mapRatingData = (rating: any) => {
  if (!rating) return {};
  const valueRating = rating?.value?.split('+');
  return {
    label: `From ${valueRating?.length && valueRating[0]}`,
    value: Number(valueRating?.length && valueRating[0]),
  };
};

export const clean = (arr: any) => {
  return arr.filter((element: any) => {
    return element !== undefined && element !== null;
  });
};

export const formatTimeDuration = (time: string) => {
  const [part1, part2] = time.split(':').map(Number);
  if (part1 === 0) {
    return `${part2}s`;
  } else {
    return `${part1}min`;
  }
};

export enum UserCourseProgressStatus {
  PROGRESS = 'PROGRESS',
  COMPLETED = 'COMPLETED',
}
export const getAvatar = () => {
  const randomNumber = Math.floor(Math.random() * 1_000_000);
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${randomNumber}`;
};

export enum TypeReactions {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

// log code
export const generateRandomId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const getRandomValue = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return `${getRandomValue()}${getRandomValue()}-${getRandomValue()}-4${getRandomValue().substr(
    0,
    3
  )}-${getRandomValue()}-${getRandomValue()}${getRandomValue()}${getRandomValue()}`;
};

export enum COLOR_THEME {
  WHITE = 'white',
  SKY_BLUE = 'skyBlue',
  LIGHT_PINK = 'lightPink',
  LIGHT_YELLOW = 'lightYellow',
  LIGHT_BEIGE = 'lightBeige',
  BLACK = 'black',
  GRAPHITE = 'graphite',
  DARK_GRAY = 'darkGray',
  NAVY_BLUE = 'navyBule',
  CHARCOAL_GRAY = 'charcoalGray',
  CHEST_BROWN = 'chestnutBrown',
}
export const enum UserType {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
}

export const formatWalletAddress = (
  address: string,
  startLength = 6,
  endLength = 4
) => {
  if (!address || address.length < startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export const isValidURL = (url: string) => {
  try {
    new URL(url); // If the URL is valid, this will not throw an error
    return true;
  } catch (e) {
    return false; // If invalid, it will throw an error
  }
};

export const formatNumber = (num: any) => {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export const formatPrice = (price: any) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(150)).div(BigNumber.from(100));
}
