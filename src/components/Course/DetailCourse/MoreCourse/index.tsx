import NoData from '@/components/ListCourse/NoData';
import Text from '@/components/UI/Text';
import { TypeReactions, formatWalletAddress } from '@/utils/common';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import {
  useGetListCourse,
  useGetListReview,
  useLikeReview,
  useUnLikeComment,
} from '../../ListCourse/service';
import CardCourseMore from './CardCourseMore';
import Comment from './Comment';
import CardCourse from '@/components/CourseSearch/ListCourse/CardCourse';

const MoreCourse = (props: any) => {
  const { author, courseId } = props;

  const { t } = useTranslation('common');

  const { dataCourses, loadMore, noMore, reload } = useGetListCourse({
    pageSize: 3,
    authors: author?.id,
    externalIds: courseId,
  });
  const { dataListReview, run: runGetListReview, mutate } = useGetListReview();

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
  // const handleUnLikeComment = (id: string) => {
  //   runRemoveLikeComment(id);
  // };

  useEffect(() => {
    if (author?.id && courseId) {
      reload();
      runGetListReview(courseId);
    }
  }, [author?.id, courseId]);

  const reloadListReview = () => {
    runGetListReview(courseId);
  };

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

  const generateMentors = () => {
    if (author?.fullName) {
      return author?.fullName;
    }
    return formatWalletAddress(author?.walletAddress);
  };

  if (!author) return null;
  return (
    <div className="flex flex-col gap-10 pb-10 border-b-1 border-b-black-10">
      {dataCourses?.length > 0 && (
        <div className="flex flex-col gap-6">
          <Text className="text-white truncate w-full" type="font-20-600">
            {t('More Course By')} {generateMentors()}
          </Text>
          <div className="lg:grid lg:grid-cols-3 flex h-full items-center lg:overflow-hidden overflow-auto gap-6">
            {dataCourses?.length > 0 &&
              dataCourses.map((item: any, key: number) => {
                // return <CardCourseMore noLike item={item} key={key} />;
                return <CardCourse noLike item={item} key={key} />;
              })}
          </div>
          {dataCourses?.length == 0 && <NoData />}
        </div>
      )}

      {dataListReview?.data?.length > 0 &&
        dataListReview?.data.map((item: any, index: number) => {
          <div className="flex flex-col gap-4">
            return (
            <Text className="text-white" type="font-20-600">
              {t('Reviews')}
            </Text>
            <Comment
              handleUnDisLikeReview={handleUnDisLikeReview}
              handleUnLikeReview={handleUnLikeReview}
              handleDisLikeReview={handleDisLikeReview}
              handleLikeReview={handleLikeReview}
              item={item}
              key={index}
            />
            );
          </div>;
        })}
    </div>
  );
};
export default MoreCourse;
