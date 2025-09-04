import { useReviewCours } from '@/components/Course/ListCourse/service';
import InputTextArena from '@/components/UI/InputTextArena';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { ROUTE_PATH } from '@/utils/const';
import { Button, ModalBody } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import ReactStars from 'react-stars';
import useNavigate from '@/hooks/useNavigate';
import { reviewedAtom } from '..';
import { useAtom } from 'jotai';
import CustomModal from '@/components/UI/CustomModal';

interface IFormEndCourse {
  courseId: string;
  handleGetReviews: VoidFunction;
  visible: boolean;
  onVisible: VoidFunction;
}

const FormEndCourse = forwardRef((props: IFormEndCourse) => {
  const { courseId, handleGetReviews, visible, onVisible } = props;
  const { t } = useTranslation('common');
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
    <CustomModal
      placementMoblie="center"
      size="2xl"
      isOpen={visible}
      onClose={onVisible}
      className="max-w-[600px] rounded-xl overflow-hidden"
    >
      <div className="bg-[#0E0E0E] rounded-xl p-6 border-2 border-[rgba(255,255,255,0.05)] shadow-[0px_4px_0px_0px_rgba(255,255,255,0.05)]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <Text className="text-letter text-2xl font-semibold tracking-[-0.03em]">
              {submitReviewSuccess
                ? t('lesson.endCourse.congratulations')
                : t('lesson.endCourse.courseReview')}
            </Text>
            <Text className="text-letter/60 text-sm">
              {submitReviewSuccess
                ? t('lesson.endCourse.completedCourse')
                : t('lesson.endCourse.shareExperience')}
            </Text>
          </div>
          <button
            onClick={onVisible}
            className="text-letter/80 hover:opacity-85 active:scale-[98%] hover:text-letter"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {submitReviewSuccess ? (
            <div className="flex flex-col items-center gap-6">
              <Text type="font-18-600" className="text-center">
                🙌 {t('lesson.endCourse.congratsCompleted')}
              </Text>

              <Button
                radius="full"
                onPress={() => {
                  navigate(ROUTE_PATH.HOME);
                  onVisible();
                }}
                className="bg-main min-w-[200px] w-max min-h-[50px] rounded hover:opacity-90 transition-opacity"
              >
                <Text type="font-16-500" className="text-letter">
                  {t('lesson.endCourse.findMoreCourses')}
                </Text>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Text className="text-letter font-medium text-center">
                  {t('lesson.endCourse.selectRating')}
                </Text>
                <ReactStars
                  count={5}
                  color1="#D9D9D9"
                  value={valueRating}
                  color2="#F2B021"
                  onChange={ratingChanged}
                  size={40}
                  className="flex items-center gap-4 mx-auto"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Text className="text-letter font-medium">
                  {t('lesson.endCourse.yourReview')}
                </Text>
                <InputTextArena
                  className="w-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)] rounded-lg"
                  minRows={6}
                  placeholder={t('lesson.endCourse.reviewPlaceholder')}
                  value={valueComment}
                  onChange={(e: any) => setValueComment(e.target.value)}
                  isBlack
                />
              </div>

              <div className="flex justify-end mt-2">
                <Button
                  radius="full"
                  isDisabled={!valueRating}
                  isLoading={loadingComment}
                  onPress={handleClickSave}
                  className="bg-main min-w-[142px] w-max min-h-[40px] rounded hover:opacity-90 transition-opacity"
                >
                  <Text type="font-16-500" className="text-letter">
                    {t('lesson.endCourse.submitReview')}
                  </Text>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
});

FormEndCourse.displayName = 'FormEndCourse';

export default FormEndCourse;

const CloseIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.3333 16.0013C29.3333 23.3651 23.3638 29.3346 16 29.3346C8.63616 29.3346 2.66663 23.3651 2.66663 16.0013C2.66663 8.63751 8.63616 2.66797 16 2.66797C23.3638 2.66797 29.3333 8.63751 29.3333 16.0013ZM11.9595 11.9608C12.35 11.5703 12.9832 11.5703 13.3737 11.9608L15.9999 14.5871L18.6261 11.9609C19.0167 11.5703 19.6498 11.5703 20.0403 11.9609C20.4309 12.3514 20.4309 12.9846 20.0403 13.3751L17.4141 16.0013L20.0403 18.6275C20.4308 19.018 20.4308 19.6512 20.0403 20.0417C19.6498 20.4322 19.0166 20.4322 18.6261 20.0417L15.9999 17.4155L13.3737 20.0417C12.9832 20.4322 12.35 20.4322 11.9595 20.0417C11.569 19.6512 11.569 19.018 11.9595 18.6275L14.5857 16.0013L11.9595 13.375C11.5689 12.9845 11.5689 12.3514 11.9595 11.9608Z"
        fill="url(#paint0_linear_876_55093)"
        fillOpacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_876_55093"
          x1="16"
          y1="2.66797"
          x2="16"
          y2="29.3346"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#999999" />
        </linearGradient>
      </defs>
    </svg>
  );
};
