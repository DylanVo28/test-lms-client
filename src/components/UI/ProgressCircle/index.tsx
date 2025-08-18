import Image from 'next/image';
import React from 'react';

const ProgressCircle = ({ value }: { value: number }) => {
  // Ensure the value is within 0 to 100
  const progress = Math.min(Math.max(value, 0), 100);
  const angle = (progress / 100) * 360;

  return (
    <div className="relative w-10 h-10">
      {/* Background circle */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="w-full h-full rounded-full border-2 border-gray-300"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className="absolute w-full h-full rounded-full border-2 border-main transition-transform duration-300"
          style={{
            clipPath: 'inset(0 50% 0 0)',
            transform: `rotate(${Math.min(angle, 180)}deg)`,
          }}
        ></div>

        {angle > 180 && (
          <div
            className="absolute w-full h-full rounded-full border-2 border-main transition-transform duration-300"
            style={{
              clipPath: 'inset(0 0 0 50%)',
              transform: `rotate(${angle}deg)`,
            }}
          ></div>
        )}
      </div>

      {/* Center image */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/images/img-trophy-line.png"
          width={16}
          height={16}
          alt="Trophy"
          className="w-5 h-5"
        />
      </div>
    </div>
  );
};

export default ProgressCircle;
