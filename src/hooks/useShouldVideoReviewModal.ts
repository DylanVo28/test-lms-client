import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { lastModalShowTimeAtom, reviewedAtom } from '@/components/Lesson';

const MODAL_COOLDOWN = 1000 * 60 * 30; // 30 minutes

interface UseShouldVideoReviewModalProps {
  courseId: string;
  progressValue: number;
  progressTotal: number;
}

export const useShouldVideoReviewModal = ({
  courseId,
  progressValue,
  progressTotal,
}: UseShouldVideoReviewModalProps) => {
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);
  const [lastModalShowTimes, setLastModalShowTimes] = useAtom(
    lastModalShowTimeAtom
  );
  const [reviewed] = useAtom(reviewedAtom);

  const getModalStorageKey = (type: 'dismissed' | 'shown') => {
    return `reviewModal_${type}_${courseId}`;
  };

  const shouldShowReviewModal = () => {
    if (!courseId) return false;

    const isCompleted80PercentCourse =
      (progressValue / progressTotal) * 100 >= 80;
    const now = Date.now();

    // Check last shown time for this specific course
    const lastShowTime = lastModalShowTimes[courseId] || 0;
    const hasEnoughTimePassed = now - lastShowTime > MODAL_COOLDOWN;

    // Check last dismissed time for this specific course
    const lastDismissedTime = localStorage.getItem(
      getModalStorageKey('dismissed')
    );
    const hasNotDismissedRecently =
      !lastDismissedTime || now - parseInt(lastDismissedTime) > MODAL_COOLDOWN;

    return (
      isCompleted80PercentCourse &&
      !reviewed &&
      hasEnoughTimePassed &&
      hasNotDismissedRecently
    );
  };

  const handleCloseReviewModal = () => {
    setIsOpenReviewModal(false);
    if (courseId) {
      localStorage.setItem(
        getModalStorageKey('dismissed'),
        Date.now().toString()
      );
    }
  };

  // Check conditions and show modal when appropriate
  useEffect(() => {
    if (shouldShowReviewModal() && courseId) {
      setIsOpenReviewModal(true);
      setLastModalShowTimes((prev) => ({
        ...prev,
        [courseId]: Date.now(),
      }));
    }
  }, [progressValue, progressTotal, reviewed, courseId]);

  // Clear modal state when course changes
  useEffect(() => {
    setIsOpenReviewModal(false);
  }, [courseId]);

  return {
    isOpenReviewModal,
    handleCloseReviewModal,
  };
};
