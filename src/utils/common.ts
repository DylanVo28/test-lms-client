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
