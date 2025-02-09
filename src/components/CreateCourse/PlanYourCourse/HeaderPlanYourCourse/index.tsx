import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';

const HeaderPlanYourCourse = ({
  handleSaveForm,
  handlePublishForm,
  loading,
  loadingPublish,
}: {
  handleSaveForm: VoidFunction;
  handlePublishForm: VoidFunction;
  loading?: boolean;
  loadingPublish?: boolean;
}) => {
  const router = useRouter();

  return (
    <div className="w-full p-4 sticky top-0 bg-primary z-[1000] shadow-2xl flex justify-between items-center border-b border-b-black-10">
      <div className="flex items-center gap-5">
        <Button
          onClick={() => router.push(ROUTE_PATH.LIST_COURSE)}
          variant="light"
          radius="sm"
          size="md"
        >
          <div className="flex items-center gap-1">
            <IconBlack />
            <Text type="font-16-500" className="text-white">
              Back to courses
            </Text>
          </div>
        </Button>
        <div className="w-[1px] h-6 bg-[#595959]" />
        <Text type="font-16-500" className="text-white">
          0 min of video content uploaded
        </Text>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSaveForm}
          isLoading={loading}
          className="bg-transparent border-1 border-main min-w-[96px] !min-h-[40px] rounded"
        >
          <Text type="font-16-600" className="text-main">
            Save
          </Text>
        </Button>
        <Button
          onClick={handlePublishForm}
          isLoading={loadingPublish}
          className="bg-main min-w-[96px] !min-h-[40px] rounded"
        >
          <Text type="font-16-600" className="text-white">
            Publish
          </Text>
        </Button>
        {/* <SelectCustom
          placeholder="Preview"
          className="min-w-[146px]"
          isLesson
          options={[
            {
              key: 1,
              label: 'As instructor',
            },
            {
              key: 2,
              label: 'As Student',
            },
          ]}
        /> */}
      </div>
    </div>
  );
};
export default HeaderPlanYourCourse;

const IconBlack = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.02344 10.0004L13.1484 14.1254L11.9701 15.3037L6.66677 10.0004L11.9701 4.69704L13.1484 5.87538L9.02344 10.0004Z"
        fill="white"
      />
    </svg>
  );
};
