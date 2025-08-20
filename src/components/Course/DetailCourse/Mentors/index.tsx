import { userRequest } from '@/components/MyProfile/service';
import {
  IconDicord,
  IconReadmi,
  IconTelegram,
  IconTwiter,
  IconFb,
  IconLinkedIn,
  IconYoutube,
  IconX,
} from '@/components/UI/Icons/IconSocial';
import IconStudent from '@/components/UI/Icons/IconStudent';
import IconVideo from '@/components/UI/Icons/IconVideo';
import Text from '@/components/UI/Text';
import { useProfile } from '@/store/profile/useProfile';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Rater from 'react-rater';
import { useFollowMentor, useUnFollowMentor } from './service';
import { toast } from '@/components/UI/Toast/toast';
import { formatWalletAddress, isValidURL } from '@/utils/common';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAccount } from 'wagmi';
import { useTranslation } from 'next-i18next';

const Mentors = ({ mentor }: any) => {
  const { t } = useTranslation('common');
  const { profile } = useProfile();
  const accessToken = useAccessToken();

  const [mentorProfile, setMentorProfile] = useState<any>();

  const requestFollowMentor = useFollowMentor({
    onSuccess: async (res: any) => {
      toast.success('Follow successfully');
      const newData = {
        ...mentorProfile,
        isFollowing: true,
      };
      setMentorProfile(newData);
    },
    onError: (error: any) => {},
  });

  const requestUnFollowMentor = useUnFollowMentor({
    onSuccess: async (res: any) => {
      toast.success('Unfollow successfully');
      const newData = {
        ...mentorProfile,
        isFollowing: false,
      };
      setMentorProfile(newData);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const getDetail = async () => {
    const params = {
      userId: accessToken ? profile?.id : '',
    };
    try {
      const response = await userRequest.getUserDetail(mentor.id, params);
      setMentorProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mentor?.id) {
      getDetail();
    }
  }, [mentor?.id]);

  const generateMentors = () => {
    if (mentor?.fullName) {
      return mentor?.fullName;
    }
    return formatWalletAddress(mentor?.walletAddress);
  };

  const isNotMentor = mentor?.id !== profile?.id;

  const followMentor = () => {
    if (mentorProfile?.isFollowing) {
      requestUnFollowMentor.run(mentorProfile?.id);
    } else {
      requestFollowMentor.run(mentorProfile?.id);
    }
  };

  const openSocial = (url: string) => {
    if (isValidURL(url)) {
      window.open(url, '_blank');
    } else {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(url);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 border-b-1 border-b-black-10 pb-5">
      <Text className="text-letter" type="font-20-600">
        {t('course.mentors')}
      </Text>
      <div className="flex flex-col md:flex-row md:items-start gap-5">
        <Image
          alt=""
          src={mentor?.avatar || '/images/img-mentor-default.png'}
          width={40}
          height={40}
          className="rounded w-[120px] h-[120px] bg-[#212121]"
          onError={(e: any) => {
            e.target.srcset = '/images/user-line.png';
          }}
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Text className="text-letter" type="font-16-600">
              {generateMentors()}
            </Text>
            <div className="flex flex-col gap-2">
              <Text className="text-letter/70" type="font-14-400">
                {mentor?.headline}
              </Text>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-x-2 items-center">
                  <Text type="font-14-400" className="text-letter">
                    {(mentorProfile?.instructorInfo?.avgRate || 5)?.toFixed(
                      1
                    ) || 0}
                  </Text>
                  <Rater
                    total={5}
                    rating={mentorProfile?.instructorInfo?.avgRate || 5}
                  />
                </div>
                <Text
                  type="font-14-400"
                  className="text-letter whitespace-nowrap"
                >
                  {mentorProfile?.instructorInfo?.countReviews || 0}{' '}
                  {t('course.reviews')}
                </Text>
                <div className="w-[1px] h-5 bg-[#BFBFBF]" />
                <div className="flex items-center gap-1">
                  <IconStudent />
                  <Text type="font-14-400" className="text-letter">
                    {mentorProfile?.instructorInfo?.countStudents || 0}{' '}
                    {t('course.students')}
                  </Text>
                </div>
                <div className="w-[1px] h-5 bg-[#BFBFBF]" />
                <div className="flex items-center gap-1">
                  <IconVideo />
                  <Text type="font-14-400" className="text-letter">
                    {mentorProfile?.instructorInfo?.countCourses || 0}{' '}
                    {t('course.courses')}
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {mentor?.biography && (
                <Text className="text-letter" type="font-14-400">
                  {mentor?.biography}
                </Text>
              )}
              <div className="flex items-center gap-2">
                {/* {mentor?.x && (
                <div
                  className="w-7 h-7 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-white rounded-full flex justify-center items-center"
                  onClick={() => window.open(mentor?.x, '_blank')}
                >
                  <IconTwiter />
                </div>
              )} */}
                {mentor?.facebook && (
                  <div
                    className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                    onClick={() => openSocial(mentor?.facebook)}
                  >
                    <IconFb />
                  </div>
                )}
                {mentor?.youtube && (
                  <div
                    className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                    onClick={() => openSocial(mentor?.youtube)}
                  >
                    <IconYoutube />
                  </div>
                )}
                {mentor?.linkedin && (
                  <div
                    className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                    onClick={() => openSocial(mentor?.linkedin)}
                  >
                    <IconLinkedIn />
                  </div>
                )}
                {mentor?.x && (
                  <div
                    className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                    onClick={() => openSocial(mentor?.x)}
                  >
                    <IconX />
                  </div>
                )}
                {/* <div className="w-7 h-7 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-white rounded-full flex justify-center items-center">
                <IconTelegram />
              </div>
              <div className="w-7 h-7 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-white rounded-full flex justify-center items-center">
                <IconDicord />
              </div>
              <div className="w-7 h-7 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-white rounded-full flex justify-center items-center">
                <IconReadmi />
              </div> */}
              </div>
            </div>
          </div>

          {/* {isNotMentor && (
            <Button
              isLoading={requestFollowMentor?.loading}
              className="border min-w-[80px] bg-main-20 rounded-[99px] bgFollow border-main font-semibold text-base w-max text-main"
              onPress={followMentor}
              isDisabled={!accessToken}
            >
              {!mentorProfile?.isFollowing ? 'Follow' : 'Unfollow'}
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};
export default Mentors;
