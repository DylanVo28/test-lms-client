import Text from '@/components/UI/Text';
import Comment from './Comment';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import CardCourse from '@/components/CourseSearch/ListCourse/CardCourse';
import { getAccessToken } from '@/store/auth';
import {
  useCommentCours,
  useGetListComment,
  useGetListCourse,
  useGetListReview,
  useLikeComment,
  useLikeReview,
  useRemoveLikeComment,
} from '../../ListCourse/service';
import { useEffect } from 'react';
import CardComment from './CardComment';
import CustomButtonComment from '@/components/UI/CustomButtonComment';
import NoData from '@/components/ListCourse/NoData';

const MoreCourse = (props: any) => {
  const { author, courseId } = props;
  const token = getAccessToken();

  const { dataCourses, loadMore, noMore, reload } = useGetListCourse({
    pageSize: 3,
    authors: author?.id,
    externalIds: courseId,
  });
  const { dataListReview, run: runGetListReview, mutate } = useGetListReview();

  // const { run: runRemoveLikeComment } = useRemoveLikeComment({
  //   onSuccess(res) {
  //     console.log(res, 'res');

  //     const newData = dataListComment.data.map((item: any) => {
  //       if (item.id === res?.data?.courseCommentId) {
  //         const newReaction = item?.reactions?.filter(
  //           (reaction: any) => reaction?.id !== res?.data?.id
  //         );
  //         return {
  //           ...item,
  //           reactions: newReaction,
  //         };
  //       } else {
  //         return item;
  //       }
  //     });

  //     mutate({
  //       ...dataListComment,
  //       data: newData,
  //     });
  //   },
  // });
  const { run: runLikeReview } = useLikeReview({
    onSuccess(res) {
      console.log(res, 'res');
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
  // const handleLikeComment = (id: string) => {
  //   const body = {
  //     name: 'like',
  //     code: '1',
  //   };
  //   runLikeComment(body, id);
  // };
  // const handleUnLikeComment = (id: string) => {
  //   runRemoveLikeComment(id);
  // };

  useEffect(() => {
    if (author?.id && courseId) {
      reload();
      runGetListReview(courseId);
    }
  }, [author, courseId]);

  const reloadListReview = () => {
    runGetListReview(courseId);
  };

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

  const generateMentors = () => {
    if (author?.firstName || author?.lastName) {
      return `${author?.firstName} ${author?.lastName}`;
    }
    return author?.walletAddress;
  };

  console.log(dataCourses, 'dataCourses');

  if (!author) return null;
  return (
    <div className="flex flex-col gap-10 pb-10 border-b-1 border-b-black-10">
      <div className="flex flex-col gap-6">
        <Text className="text-white truncate w-full" type="font-20-600">
          More Course By {generateMentors()}
        </Text>
        <div className="md:grid md:grid-cols-3 flex items-center overflow-auto gap-6">
          {dataCourses?.length > 0 &&
            dataCourses.map((item: any, key: number) => {
              return <CardCourse noLike item={item} key={key} />;
            })}
        </div>
        {dataCourses?.length == 0 && <NoData />}
      </div>
      <div className="flex flex-col gap-10">
        <Text className="text-white" type="font-20-600">
          Comments
        </Text>

        {/* {!token ? (
          <CustomButtonComment />
        ) : (
          <CardComment
            reloadListReview={reloadListReview}
            courseId={courseId}
          />
        )} */}

        <div className="flex flex-col gap-6">
          {dataListReview?.data?.length > 0 &&
            dataListReview?.data.map((item: any, index: number) => {
              return (
                <Comment
                  handleLikeReview={handleLikeReview}
                  item={item}
                  key={index}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default MoreCourse;
