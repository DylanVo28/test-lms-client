import Comment from '@/components/Course/DetailCourse/MoreCourse/Comment';
import {
  useLikeReview,
  useUnLikeComment,
} from '@/components/Course/ListCourse/service';
import NoData from '@/components/ListCourse/NoData';
import IconSearch from '@/components/UI/Icons/IconSearch';
import InputText from '@/components/UI/InputText';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { TypeReactions } from '@/utils/common';
import { Progress, Spinner } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Rater from 'react-rater';
import ReactStars from 'react-stars';

const Reviews = ({
  courseId,
  dataListReviewSummary,
  onChange,
  dataListReview,
  loading,
  mutate,
}: {
  onChange: any;
  dataListReviewSummary: any;
  dataListReview: any;
  mutate: any;
  loading: boolean;

  courseId: string;
}) => {
  const { t } = useTranslation('common');
  const [valueSearch, setValueSearch] = useState('');
  const [valueLevel, setValueLevel] = useState<any>();

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
    const filter = {
      search: valueSearch,
      level: valueLevel,
    };
    onChange(courseId, filter);
  }, [valueSearch, valueLevel]);

  const { run: runLikeReview } = useLikeReview({
    onSuccess(res) {
      const reviewIndex = dataListReview.data.findIndex(
        (review: any) => review?.id === res?.data?.courseReviewId
      );

      if (reviewIndex !== -1) {
        const reactionIndex = dataListReview.data[
          reviewIndex
        ].reactions.findIndex((reaction: any) => reaction.id === res?.data?.id);
        if (reactionIndex !== -1) {
          dataListReview.data[reviewIndex].reactions[reactionIndex] = res?.data;
        } else {
          dataListReview.data[reviewIndex].reactions.push(res?.data);
        }
      } else {
        dataListReview.data.push(res?.data);
      }
    },
  });

  const { run: runDisLikeReview } = useLikeReview({
    onSuccess(res) {
      const reviewIndex = dataListReview.data.findIndex(
        (review: any) => review?.id === res?.data?.courseReviewId
      );

      if (reviewIndex !== -1) {
        const reactionIndex = dataListReview.data[
          reviewIndex
        ].reactions.findIndex((reaction: any) => reaction.id === res?.data?.id);

        if (reactionIndex !== -1) {
          dataListReview.data[reviewIndex].reactions[reactionIndex] = res?.data;
        } else {
          dataListReview.data[reviewIndex].reactions.push(res?.data);
        }
      } else {
        dataListReview.data.push(res?.data);
      }
    },
  });

  const { run: runUnLikeReview } = useUnLikeComment({
    onSuccess(res) {
      const newData = dataListReview.data.map((item: any) => {
        if (item.id === res?.data?.courseReviewId) {
          const newReaction = item?.reactions?.filter(
            (reaction: any) => reaction?.id !== res?.data?.id
          );
          return {
            ...item,
            reactions: newReaction,
          };
        } else {
          return item;
        }
      });

      mutate({
        ...dataListReview,
        data: newData,
      });
    },
  });
  const { run: runUnDisLikeReview } = useUnLikeComment({
    onSuccess(res) {
      const newData = dataListReview.data.map((item: any) => {
        if (item.id === res?.data?.courseReviewId) {
          const newReaction = item?.reactions?.filter(
            (reaction: any) => reaction?.id !== res?.data?.id
          );
          return {
            ...item,
            reactions: newReaction,
          };
        } else {
          return item;
        }
      });

      mutate({
        ...dataListReview,
        data: newData,
      });
    },
  });

  const handleLikeReview = (id: string) => {
    const body = {
      commentId: '',
      reviewId: id,
      name: TypeReactions.LIKE,
      code: '1',
      keyword: '',
    };
    runLikeReview(body);
  };
  const handleDisLikeReview = (id: string) => {
    const body = {
      commentId: '',
      reviewId: id,
      name: TypeReactions.DISLIKE,
      code: '1',
      keyword: '',
    };
    runDisLikeReview(body);
  };

  const handleUnLikeReview = (id: string) => {
    runUnLikeReview(id);
  };
  const handleUnDisLikeReview = (id: string) => {
    runUnDisLikeReview(id);
  };

  return (
    <div className="md:pt-[14px] py-[40px] md:py-0 flex flex-col gap-2 md:px-[80px]">
      <Text type="font-20-600">{t('Student feedbacks')}</Text>
      <div className="flex gap-2 items-start mb-8">
        <div className="">
          <div className="flex items-center gap-2">
            <Text type="font-20-600">
              {dataListReviewSummary?.data?.avgRate?.toFixed(1) || 0}
            </Text>
            <div className="text-black-5 text-md">
              (base on {dataListReviewSummary?.data?.total} reviews)
            </div>
          </div>

          <ReactStars
            count={5}
            color1="#D9D9D9"
            edit={false}
            color2="#F2B021"
            value={dataListReviewSummary?.data?.avgRate || 5}
            size={14}
            className="flex items-center gap-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Text type="font-20-600">{t('Reviews')}</Text>

        {/* <InputText
          className="max-w-[470px]"
          placeholder={t('Search')}
          isLesson
          onChange={(e: any) => {
            setValueSearch(e.target.value);
          }}
          startContent={<IconSearch />}
        /> */}
        <SelectCustom
          isLesson
          value={valueLevel}
          onChange={(e: any) => {
            setValueLevel(e.target.value);
          }}
          options={[
            {
              key: 5,
              label: t('5 star'),
            },
            {
              key: 4,
              label: t('4 star'),
            },
            {
              key: 3,
              label: t('3 star'),
            },
            {
              key: 2,
              label: t('2 star'),
            },
            {
              key: 1,
              label: t('1 star'),
            },
          ]}
          className="max-w-[117px]"
          placeholder={t('All Ratings')}
        />
      </div>
      <div className="flex flex-col gap-6">
        {!loading && (
          <>
            {dataListReview?.data?.length > 0 &&
              dataListReview?.data.map((item: any, index: number) => {
                return (
                  <Comment
                    handleUnDisLikeReview={handleUnDisLikeReview}
                    handleUnLikeReview={handleUnLikeReview}
                    handleDisLikeReview={handleDisLikeReview}
                    handleLikeReview={handleLikeReview}
                    item={item}
                    key={index}
                  />
                );
              })}

            {dataListReview?.data?.length === 0 && (
              <NoData text={t('No reviews')} />
            )}
          </>
        )}

        {loading && (
          <div className="flex items-center mt-4 justify-center">
            <Spinner color="success" />
          </div>
        )}

        {/* <Button
          variant="light"
          radius="full"
          size="sm"
          className="hover:bg-main-20 w-max"
        >
          <div className="flex items-center gap-[2px]">
            <Text type="font-14-500" className="text-main">
              {t('See More')}
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
