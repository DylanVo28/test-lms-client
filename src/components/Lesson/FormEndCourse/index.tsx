import { useReviewCours } from '@/components/Course/ListCourse/service';
import InputTextArena from '@/components/UI/InputTextArena';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ReactStars from 'react-stars';
import useNavigate from '@/hooks/useNavigate';
import { reviewedAtom } from '..';
import { useAtom } from 'jotai';

const FormEndCourse = ({
  courseId,
  handleGetReviews,
}: {
  handleGetReviews: VoidFunction;
  courseId: string;
}) => {
  const [valueRating, setValueRating] = useState<any>();
  const [valueComment, setValueComment] = useState<any>();
  const router = useRouter();
  const { navigate } = useNavigate();
  const [reviewed, setReviewed] = useAtom(reviewedAtom);

  const [submitReviewSuccess, setSubmitReviewSuccess] =
    useState<boolean>(false);

  const { run: runReviewCours, loading: loadingComment } = useReviewCours({
    onSuccess() {
      setValueComment('');
      setValueRating(0);
      setSubmitReviewSuccess(true);
      handleGetReviews();
      setReviewed(true);
    },
    onError(err) {
      setValueComment('');
      setValueRating(0);
      toast.error(err?.message);
    },
  });

  const ratingChanged = (rating: any) => {
    setValueRating(rating);
  };

  const handleClickSave = () => {
    const body = {
      rating: valueRating ? valueRating : 0,
      review: valueComment,
    };
    runReviewCours(body, courseId);
  };
  return (
    <div className="w-full md:min-h-[566px] min-h-[400px] relative flex  justify-center md:pt-20 p-4 md:p-12 group">
      {submitReviewSuccess ? (
        <div className="flex flex-col pt-20 items-center gap-6 md:w-5/12">
          <Text type="font-20-600" className="text-center">
            🙌 {'Congratulations on completing the course!'}
          </Text>

          <Button
            radius="full"
            onPress={() => navigate(ROUTE_PATH.HOME)}
            className=" bg-transparent border-1 border-main min-w-[162px] w-max min-h-[50px] rounded"
          >
            <Text type="font-16-500" className="text-main">
              {'Find more courses'}
            </Text>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 md:w-5/12">
          <Text type="font-20-600" className="text-center">
            🙌 {'Congratulations on completing the course!'}
            <br /> {'Would you like to leave a review?'}
          </Text>
          <div className="flex flex-col gap-2 w-full">
            <Text className="text-center text-[16px] font-semibold">
              {'Select rating'}
            </Text>

            <ReactStars
              count={5}
              color1="#D9D9D9"
              value={valueRating}
              color2="#F2B021"
              onChange={ratingChanged}
              size={60}
              className="flex items-center gap-4 mx-auto"
            />
            <InputTextArena
              className="w-full mt-4"
              minRows={6}
              placeholder={
                'Tell us about your own personal experience taking this course. Was it right for you?'
              }
              value={valueComment}
              onChange={(e: any) => setValueComment(e.target.value)}
              isBlack
            />
            <div className="flex items-end justify-end mt-2">
              <Button
                radius="full"
                isDisabled={!valueRating}
                isLoading={loadingComment}
                onPress={handleClickSave}
                className=" bg-main min-w-[142px] w-max min-h-[40px] rounded"
              >
                <Text type="font-16-500" className="text-white">
                  {'Save and continue'}
                </Text>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FormEndCourse;
