import { serviceGetUserVolumn } from '@/layout/MainLayout/MainHeader/service';
import { useState, useEffect } from 'react';

export interface IVolumnDataRow {
  date: string;
  account_id: string;
  perp_volume: number;
  perp_taker_volume: number;
  perp_maker_volume: number;
  total_fee: number;
  broker_fee: number;
  address: string;
  realized_pnl: number;
  points: number;
}

export interface IVolumnDataResponse {
  success: boolean;
  data: {
    rows: IVolumnDataRow[];
    meta: {
      total: number;
      records_per_page: number;
      current_page: number;
    };
    snapshot_time: number;
  };
  timestamp: number;
}

export const useVolumnData = ({ address }: { address: string }) => {
  const [data, setData] = useState<IVolumnDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      setLoading(true);
      setError(null);

      try {
        const response = await serviceGetUserVolumn(address);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const totalPoint = data?.data?.rows.reduce((acc, row) => {
    return acc + row.points;
  }, 0);

  return { data, loading, error, totalPoint };
};
