import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

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
  // return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${randomNumber}`;
  return '/images/img-mentor-default.png';
};

export enum TypeReactions {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export const truncateWalletInText = (
  text: string,
  startChars: number = 3,
  endChars: number = 2
): string => {
  if (!text) return text;

  const walletRegex = /0x[a-fA-F0-9]{40}/g;

  return text.replace(walletRegex, (match) => {
    if (match.length <= startChars + endChars + 3) {
      return match;
    }
    return `${match.slice(0, startChars)}...${match.slice(-endChars)}`;
  });
};

export const truncateWalletAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

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

export function extractRevertReason(errorMessage: string): string {
  // 1️⃣ Look for `reason="execution reverted: ..."`
  const reasonMatch = errorMessage.match(/reason="([^"]+)"/);
  if (reasonMatch) {
    return `reason="${reasonMatch[1]}"`;
  }

  // 2️⃣ Look for JSON-RPC error message
  const messageMatch = errorMessage.match(
    /message":"(execution reverted:[^"]+)"/
  );
  if (messageMatch) {
    return `reason="${messageMatch[1]}"`;
  }

  // 3️⃣ Try to decode standard Error(string) from hex if present
  const hexMatch = errorMessage.match(/data":"(0x08c379a0[0-9a-fA-F]+)"/);
  if (hexMatch) {
    try {
      const hexData = '0x' + hexMatch[1].slice(10); // strip selector
      const reason = ethers.utils.defaultAbiCoder.decode(['string'], hexData);
      return `reason="execution reverted: ${reason[0]}"`;
    } catch (e) {
      console.error('Failed to decode hex reason:', e);
    }
  }

  // 4️⃣ Fallback
  return `reason=UNKNOWN`;
}
