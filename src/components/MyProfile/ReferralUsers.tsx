import React, { useState } from 'react';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import Pagination from './Pagination';
import Loading from '@/components/UI/Loading';
import Image from 'next/image';
import { formatDateTime } from './RewardHistory';
import { useQuery } from '@tanstack/react-query';
import ImageCustom from "@/components/UI/ImageCustom";

interface ReferralUser {
  walletAddress: string;
  avatar: string;
  registerDate: string;
  distributedCourses: number;
}

const ReferralUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['myProfile', 'referralUsers'],
    queryFn: async () => {
      const response = await privateRequest(request.get, API_PATH.GET_REFERRAL_USERS);
      return response?.data ?? [];
    },

  });

  const users: ReferralUser[] = data || [];

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedData = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="py-10">
          <Loading />
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead className="bg-[#1E1F25]">
              <tr>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  User
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Enrolled courses
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Register Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23262F]">
              {paginatedData.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#1E1F25] transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <ImageCustom
                      src={user.avatar || '/images/img-mentor-default.png'}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full w-[32px] h-[32px] object-cover"
                    />
                    <span className="text-sm text-gray-300">
                      {user.walletAddress.slice(0, 4)}...
                      {user.walletAddress.slice(-4)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {user.distributedCourses}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {formatDateTime(user.registerDate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ReferralUsers;
