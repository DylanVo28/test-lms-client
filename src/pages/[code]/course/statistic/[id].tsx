import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import MainLayout from '@/layout/MainLayout';
import { DefaultData } from '@/utils/const';
import { GetServerSideProps } from 'next';
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  LinkIcon,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import useCopy from '@/hooks/useCopy';
import CopyIcon from '@/icons/CopyIcon';
import Link from 'next/link';
import ReactStars from 'react-stars';
import Image from 'next/image';
import ImageCustom from "@/components/UI/ImageCustom";

declare module '@/api/constant' {
  interface ApiPath {
    COURSE_STATS: (id: string) => string;
    COURSE_STUDENTS: (id: string) => string;
    COURSE_COMMENTS: (id: string) => string;
  }
}

interface CourseStats {
  totalRevenue: number;
  activeStudents: number;
  ratingAverage: number;
  feedbackCount: number;
  totalRating: number;
}

interface Student {
  walletAddress: string;
  txHash: string;
  enrollAt: string;
  progress: string;
  enrollAmount: string;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    walletAddress: string;
  };
  content: string;
  createdAt: string;
  rating: number;
}

const CourseStatisticPage = ({
  code,
  courseId,
}: {
  code: string;
  courseId: string;
}) => {
  const { data: statsRes } = useQuery<{ data: CourseStats }>({
    queryKey: ['course-stats', courseId],
    queryFn: () => privateRequest(request.get, API_PATH.COURSE_STATS(courseId)),
  });

  const { data: studentsRes } = useQuery<{ data: Student[] }>({
    queryKey: ['course-students', courseId],
    queryFn: () =>
      privateRequest(request.get, API_PATH.COURSE_STUDENTS(courseId)),
  });

  const { data: commentsRes } = useQuery<{ data: Comment[] }>({
    queryKey: ['course-comments', courseId],
    queryFn: () =>
      privateRequest(request.get, API_PATH.COURSE_COMMENTS(courseId)),
  });

  const stats = statsRes?.data;
  const students = studentsRes?.data;
  const comments = commentsRes?.data;

  const { symbol } = useTokenInfo();

  const { onCopy } = useCopy();

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-70">
          <CardBody>
            <p className="text-sm">Active Students</p>
            <p className="text-2xl font-bold">{stats?.activeStudents || 0}</p>
          </CardBody>
        </Card>
        <Card className="bg-gray-70">
          <CardBody>
            <p className="text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">
              {stats?.totalRevenue || 0} {symbol}
            </p>
          </CardBody>
        </Card>
        <Card className="bg-gray-70">
          <CardBody>
            <p className="text-sm">Rating Average</p>
            <p className="text-2xl font-bold">
              {stats?.ratingAverage || 0} / {stats?.totalRating}
            </p>
          </CardBody>
        </Card>
        <Card className="bg-gray-70">
          <CardBody>
            <p className="text-sm">Feedback Count</p>
            <p className="text-2xl font-bold">{stats?.feedbackCount || 0}</p>
          </CardBody>
        </Card>
      </div>

      <Card className="bg-gray-70" key={symbol}>
        <CardBody>
          <h2 className="text-xl font-bold mb-4">Enrolled Students</h2>
          <Table aria-label="Enrolled students">
            <TableHeader>
              <TableColumn>WALLET ADDRESS</TableColumn>
              <TableColumn>TX HASH</TableColumn>
              <TableColumn>ENROLL DATE</TableColumn>
              <TableColumn>PROGRESS</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
            </TableHeader>
            <TableBody items={students || []}>
              {(student) => (
                <TableRow key={student.txHash}>
                  <TableCell>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => onCopy(student?.walletAddress)}
                    >
                      <span>
                        {student?.walletAddress?.slice(0, 4)}...
                        {student?.walletAddress?.slice(-4)}
                      </span>
                      <div
                        className="w-4 h-4"
                        onClick={() => onCopy(student?.walletAddress)}
                      >
                        <CopyIcon />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="flex items-center gap-2 cursor-pointer"
                      href={`https://basescan.org/tx/${student?.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        {student?.txHash?.slice(0, 4)}...
                        {student?.txHash?.slice(-4)}
                      </span>

                      <LinkIcon />
                    </Link>
                  </TableCell>
                  <TableCell>
                    {dayjs(student.enrollAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{student.progress}</TableCell>
                  <TableCell>
                    {student.enrollAmount} {symbol}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Card className="bg-gray-70">
        <CardBody>
          <h2 className="text-xl font-bold mb-4">Course Reviews</h2>
          <div className="space-y-4">
            {comments?.map((comment, index) => (
              <div key={comment.id} className="pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <ImageCustom
                      src={
                        comment.user.avatar ?? '/images/img-mentor-default.png'
                      }
                      alt={comment.user.name}
                      width={32}
                      height={32}
                      className="rounded-full w-[32px] h-[32px] object-cover"
                    />

                    <div>
                      <p>
                        {comment.user.walletAddress?.slice(0, 4)}...
                        {comment.user.walletAddress?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span>{comment.rating}/5</span>
                      <ReactStars
                        count={5}
                        color1="#D9D9D9"
                        edit={false}
                        color2="#F2B021"
                        value={comment?.rating}
                        size={14}
                        className="flex items-center gap-1"
                      />
                    </div>
                    <span className="text-gray-500 text-sm">
                      {dayjs(comment.createdAt).format('DD/MM/YYYY')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>

                {index !== comments?.length - 1 && (
                  <div className="w-full h-[1px] opacity-10 bg-[#fff] mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

CourseStatisticPage.getLayout = function getLayout(page: any) {
  const courseMedadata = page?.props?.courseMedadata;

  return (
    <>
      <SEO
        title={courseMedadata?.title || DefaultData.DefaultTitle}
        description={
          courseMedadata?.description || DefaultData.DefaultDescription
        }
        imageUrl={courseMedadata?.image || DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <MainLayout>{page}</MainLayout>
      </AppProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  if (!params?.code || !params?.id) {
    return { notFound: true };
  }

  const courseRes = await privateRequest(
    request.get,
    API_PATH.COURSE_METADATA(params.id as string),
    {
      params: {
        courseId: params.id,
      },
    }
  );

  const courseMedadata = courseRes?.data;

  return {
    props: {
      code: params.code as string,
      courseId: params.id as string,
      courseMedadata,
    },
  };
};

export default CourseStatisticPage;
