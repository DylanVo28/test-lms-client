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
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Rater from 'react-rater';

const Mentors = ({ mentor }: any) => {
  console.log('mentor', mentor);

  const [mentorProfile, setMentorProfile] = useState<any>();

  const getDetail = async () => {
    try {
      const response = await userRequest.getUserDetail(mentor.id);
      console.log('RRRRRRRRR', response);

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
    if (mentor?.firstName || mentor?.lastName) {
      return `${mentor?.firstName} ${mentor?.lastName}`;
    }
    return mentor?.walletAddress;
  };

  return (
    <div className="flex flex-col gap-6 border-b-1 border-b-black-10 pb-10">
      <Text className="text-white" type="font-20-600">
        Mentors (KOLs)
      </Text>
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <Image
          alt=""
          width={240}
          height={202}
          className="rounded w-[260px] h-full"
          src={mentor?.avatar || '/images/img-default.png'}
        />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Text className="text-white" type="font-16-600">
              {generateMentors()}
            </Text>
            <div className="flex flex-col gap-3">
              <Text className="text-black-7" type="font-14-400">
                {mentor?.headline}
              </Text>
              <div className="flex items-center gap-2 flex-wrap">
                <Text type="font-14-400" className="text-white">
                  {mentorProfile?.instructorInfo?.avgRate || 0}
                </Text>
                <Rater
                  total={5}
                  rating={mentorProfile?.instructorInfo?.avgRate || 0}
                />
                <Text type="font-14-400" className="text-white">
                  {mentorProfile?.instructorInfo?.countReviews || 0} Reviews
                </Text>
                <div className="w-[1px] h-5 bg-[#BFBFBF]" />
                <div className="flex items-center gap-1">
                  <IconStudent />
                  <Text type="font-14-400" className="text-white">
                    {mentorProfile?.instructorInfo?.countStudents || 0} Students
                  </Text>
                </div>
                <div className="w-[1px] h-5 bg-[#BFBFBF]" />
                <div className="flex items-center gap-1">
                  <IconVideo />
                  <Text type="font-14-400" className="text-white">
                    {mentorProfile?.instructorInfo?.countCourses || 0} Courses
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col  gap-4">
            <Text className="text-white" type="font-14-400">
              {mentor?.biography}
            </Text>
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
                  onClick={() => window.open(mentor?.facebook, '_blank')}
                >
                  <IconFb />
                </div>
              )}
              {mentor?.youtube && (
                <div
                  className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                  onClick={() => window.open(mentor?.youtube, '_blank')}
                >
                  <IconYoutube />
                </div>
              )}
              {mentor?.linkedin && (
                <div
                  className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                  onClick={() => window.open(mentor?.linkedin, '_blank')}
                >
                  <IconLinkedIn />
                </div>
              )}
              {mentor?.x && (
                <div
                  className="w-10 h-10 py-2 px-[5px] cursor-pointer hover:opacity-90 bg-[#161b21] rounded-[8px] flex justify-center items-center"
                  onClick={() => window.open(mentor?.x, '_blank')}
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
      </div>
    </div>
  );
};
export default Mentors;
