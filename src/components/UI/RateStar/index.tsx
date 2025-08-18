import { Star } from '@phosphor-icons/react';

const RateStar = ({ rate }: { rate: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((item, index) => {
        return (
          <Star
            key={item}
            size={12}
            color={rate > index ? '#F2B021' : '#D9D9D9'}
            weight={'fill'}
          />
        );
      })}
    </div>
  );
};
export default RateStar;
