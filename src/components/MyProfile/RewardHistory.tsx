import React, { useEffect, useState } from 'react';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import Pagination from './Pagination';
import Loading from '@/components/UI/Loading';

interface Reward {
  txHash: string;
  amount: string;
  createdAt: string;
  status?: string;
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const formattedDate = date.toLocaleDateString([], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  return `${time} ${formattedDate}`;
};

const RewardHistory = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await privateRequest(
          request.get,
          API_PATH.REWARD_HISTORY
        );
        // Mock status if not present
        const dataWithStatus = (response.data || []).map((item: any) => ({
          ...item,
          status: item.status || (Math.random() > 0.5 ? 'Success' : 'Pending'),
        }));
        setRewards(dataWithStatus);
      } catch (error) {
        console.error('Error fetching reward history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const getStatusLabel = (status?: string) => {
    if (status === 'verified') {
      return {
        label: 'Verified',
        color: '#58BD7D',
      };
    }
    if (status === 'pending') {
      return {
        label: 'Pending',
        color: '#FBBF24',
      };
    }

    return {
      label: '--',
      color: '#777E90',
    };
  };

  const totalPages = Math.ceil(rewards.length / rowsPerPage);
  const paginatedData = rewards.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="rounded-lg overflow-hidden">
      {loading ? (
        <div className="py-10">
          <Loading />
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead className="bg-[#1E1F25]">
              <tr>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Tx Hash
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23262F]">
              {paginatedData.map((reward, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#1E1F25] transition-colors"
                >
                  <td className="px-6 py-4">
                    <a
                      href={`https://testnet.ftmscan.com/tx/${reward.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-blue-400 text-xs"
                    >
                      {reward.txHash.slice(0, 4)}...{reward.txHash.slice(-4)}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#58BD7D]">
                      ${parseFloat(reward.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: getStatusLabel(reward.status).color,
                      }}
                    >
                      {getStatusLabel(reward.status).label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {formatDateTime(reward.createdAt)}
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

export default RewardHistory;
