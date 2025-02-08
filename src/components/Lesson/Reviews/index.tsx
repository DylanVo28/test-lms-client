import Comment from '@/components/Course/DetailCourse/MoreCourse/Comment';
import IconSearch from '@/components/UI/Icons/IconSearch';
import InputText from '@/components/UI/InputText';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { Button, Progress } from '@nextui-org/react';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import CommentReviews from './CommentReviews';
import Image from 'next/image';
import {
  useGetListReview,
  useGetListReviewSummary,
  useLikeReview,
} from '@/components/Course/ListCourse/service';
import NoData from '@/components/ListCourse/NoData';
import { useEffect } from 'react';

const Reviews = ({ courseId }: { courseId: string }) => {
  const { dataListReviewSummary, run: runGetListReviewSummary } =
    useGetListReviewSummary();
  const { dataListReview, run: runGetListReview, mutate } = useGetListReview();
  const { run: runLikeReview } = useLikeReview({
    onSuccess(res) {
      const newData = dataListReview.data.map((item: any) =>
        item.id === res?.data?.courseReviewId
          ? { ...item, reactions: [...item.reactions, res?.data] }
          : item
      );
      mutate({
        ...dataListReview,
        data: newData,
      });
    },
  });

  const DATA_REVIEWS = [
    {
      id: 1,
      rate: 5,
      value: dataListReviewSummary?.data?.lv5,
    },
    {
      id: 2,
      rate: 4,
      value: dataListReviewSummary?.data?.lv4,
    },
    {
      id: 3,
      rate: 3,
      value: dataListReviewSummary?.data?.lv3,
    },
    {
      id: 4,
      rate: 2,
      value: dataListReviewSummary?.data?.lv2,
    },
    {
      id: 5,
      rate: 1,
      value: dataListReviewSummary?.data?.lv1,
    },
  ];

  useEffect(() => {
    if (courseId) {
      runGetListReview(courseId);
      runGetListReviewSummary(courseId);
    }
  }, [courseId]);
  const handleLikeReview = (id: string) => {
    const body = {
      commentId: '',
      reviewId: id,
      name: 'like',
      code: '1',
      keyword: '',
    };
    runLikeReview(body);
  };

  return (
    <div className="pt-[63px] flex flex-col gap-8 px-[80px]">
      <Text type="font-20-600">Student feedback</Text>
      <div className="flex gap-3 items-start">
        <div className="w-[100px]">
          <Text type="font-20-600">
            {dataListReviewSummary?.data?.avgRate || 0}
          </Text>
          <Rater total={5} rating={dataListReviewSummary?.data?.avgRate} />
        </div>
        <div className="flex flex-col gap-2 w-full">
          {DATA_REVIEWS?.map((item) => {
            return (
              <div key={item?.id} className="flex items-center gap-2 w-full">
                <Progress
                  className="max-w-[400px]"
                  classNames={{
                    indicator: 'bg-main',
                    track: 'max-h-[8px]',
                  }}
                  maxValue={dataListReviewSummary?.data?.total}
                  value={item?.value}
                />
                <Rater total={5} rating={item?.rate} />
                <div className="flex justify-end items-end w-[50px]">
                  <Text type="font-16-500" className="text-white">
                    {item?.value}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Text type="font-20-600">Reviews</Text>

      <div className="flex items-center gap-4">
        <InputText
          className="max-w-[470px]"
          placeholder="Search"
          isLesson
          startContent={<IconSearch />}
        />
        <SelectCustom
          isLesson
          options={[
            {
              key: 5,
              label: '5 star',
            },
            {
              key: 4,
              label: '4 star',
            },
            {
              key: 3,
              label: '3 star',
            },
            {
              key: 2,
              label: '2 star',
            },
            {
              key: 1,
              label: '1 star',
            },
          ]}
          className="max-w-[117px]"
          placeholder="All Ratings"
        />
      </div>
      <div className="flex flex-col gap-6">
        {dataListReview?.data.map((item: any, index: number) => {
          return (
            <Comment
              handleLikeReview={handleLikeReview}
              item={item}
              key={index}
            />
          );
        })}
        {dataListReview?.data?.length === 0 && <NoData />}

        {/* <Button
          variant="light"
          radius="full"
          size="sm"
          className="hover:bg-main/20 w-max"
        >
          <div className="flex items-center gap-[2px]">
            <Text type="font-14-500" className="text-main">
              See More
            </Text>
            <Image
              src={'/icons/ic-arrow-drop-right-line.svg'}
              width={20}
              height={20}
              alt=""
            />
          </div>
        </Button> */}
      </div>
    </div>
  );
};
export default Reviews;
