import Text from '@/components/UI/Text';
import { Button, CircularProgress } from '@nextui-org/react';
import { Play } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

const NextVideo = ({
  dataItemNext,
  handleNextChildSection,
  handleCancelNextChilSection,
}: {
  dataItemNext: any;
  handleCancelNextChilSection: any;
  handleNextChildSection: (type: string, idNext: string) => void;
}) => {
  const [valueProgress, setValueProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValueProgress((v) => {
        if (v >= 100) {
          clearInterval(interval);
          handleNextChildSection(dataItemNext?.type, dataItemNext?.id);
          return 100;
        }
        return v + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col text-center gap-3 mb-2">
          <Text type="font-18-600" className="text-white">
            Next
          </Text>
          <Text type="font-24-700" className="text-black-5">
            {dataItemNext?.title}
          </Text>
        </div>
        <div
          onClick={() =>
            handleNextChildSection(dataItemNext?.type, dataItemNext?.id)
          }
          className="flex justify-center hover:opacity-80 cursor-pointer items-center relative"
        >
          <div className="absolute">
            <Play size={28} />
          </div>
          <CircularProgress
            aria-label="Loading..."
            color="secondary"
            classNames={{
              svg: 'w-[80px] h-[80px]',
              indicator: 'text-white/80',
            }}
            size="sm"
            value={valueProgress}
          />
        </div>
        <Button
          onClick={() => handleCancelNextChilSection()}
          className="min-w-[80px] mx-auto"
          variant="light"
        >
          <Text type="font-14-400" className="text-white ">
            Cancel
          </Text>
        </Button>
      </div>
    </div>
  );
};
export default NextVideo;
