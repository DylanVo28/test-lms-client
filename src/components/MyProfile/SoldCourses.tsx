`use client`;

import React, { useEffect, useState } from 'react';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import Pagination from './Pagination';
import { formatDateTime } from './RewardHistory';
import Loading from '@/components/UI/Loading';
import Link from 'next/link';

interface Transaction {
  walletAddress: string;
  courseTitle: string;
  purchaseDate: string;
  earnings: number;
  txHash: string;
}

const SoldCourses = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await privateRequest(
          request.get,
          API_PATH.YOUR_NETWORK
        );
        setTransactions(response?.data ?? []);
      } catch (error) {
        console.error('Error fetching network data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  console.log('transactions:::', transactions);

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
                  Wallet Address
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Tx Hash
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Course Title
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Purchase Date
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-[#777E90]">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23262F]">
              {paginatedData.map((tx, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#1E1F25] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {tx.walletAddress.slice(0, 4)}...
                      {tx.walletAddress.slice(-4)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-main">
                    <Link
                      href={`https://explorer.testnet.fantom.network/transactions/${tx.txHash}`}
                      target="_blank"
                    >
                      <span className="text-sm text-main">
                        {tx?.txHash?.slice(0, 4)}...
                        {tx?.txHash?.slice(-4)}
                      </span>
                    </Link>
                  </td>
                  {/* rewrite log */}
                  <td className="px-6 py-4 max-w-[200px]">
                    <span className="text-sm text-gray-300 line-clamp-2">
                      {tx.courseTitle}
                    </span>
                  </td>
                  <td className="px-6 py-4 ">
                    <span className="text-sm text-gray-300">
                      {formatDateTime(tx.purchaseDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#58BD7D]">
                      +{tx.earnings.toFixed(3)} USDC
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

export default SoldCourses;
