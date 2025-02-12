import { useReviewCours } from '@/components/Course/ListCourse/service';
import InputTextArena from '@/components/UI/InputTextArena';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ReactStars from 'react-stars';

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
  const [submitReviewSuccess, setSubmitReviewSuccess] =
    useState<boolean>(false);

  const { run: runReviewCours, loading: loadingComment } = useReviewCours({
    onSuccess() {
      setValueComment('');
      setValueRating(0);
      setSubmitReviewSuccess(true);
      handleGetReviews();
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
    <div className="w-full min-h-[566px] relative flex  justify-center pt-20 p-12 group">
      {submitReviewSuccess ? (
        <div className="flex flex-col pt-20 items-center gap-6 w-5/12">
          <Text type="font-20-600" className="text-center">
            🙌 Congratulations on completing the course!
          </Text>

          <Button
            radius="full"
            onClick={() => router.push(ROUTE_PATH.HOME)}
            className=" bg-transparent border-1 border-main min-w-[162px] w-max min-h-[50px] rounded"
          >
            <Text type="font-16-500" className="text-main">
              Find more courses
            </Text>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-5/12">
          <Text type="font-20-600" className="text-center">
            🙌 Congratulations on completing the course!
            <br /> Would you like to leave a review?
          </Text>
          <div className="flex flex-col gap-2 w-full">
            <Text type="font-16-400" className="text-center">
              Select rating
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
              placeholder="Tell us about your own personal experience taking this course. Was it right for you?"
              value={valueComment}
              onChange={(e: any) => setValueComment(e.target.value)}
              isBlack
            />
            <div className="flex items-end justify-end mt-2">
              <Button
                radius="full"
                isLoading={loadingComment}
                onClick={handleClickSave}
                className=" bg-main min-w-[142px] w-max min-h-[40px] rounded"
              >
                <Text type="font-16-500" className="text-white">
                  Save and continue
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
