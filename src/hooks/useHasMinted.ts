import { useQuery } from '@tanstack/react-query';
import { getMintNFTContract } from './useContract';

export const MINT_NFT_ADDRESS = '0x920680B44D50d2dC512b2C4b3577B2BA239f35Bd';

export const useHasMinted = ({
  courseId,
  address,
}: {
  address?: `0x${string}`;
  courseId: string;
}) => {
  const contract = getMintNFTContract(MINT_NFT_ADDRESS);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['hasMinted', address, courseId],
    queryFn: async () => {
      if (!contract || !address) return false;
      try {
        return await contract.hasMinted(address, courseId);
      } catch (error) {
        console.error('Error checking mint status:', error);
        return false;
      }
    },
    enabled: !!contract && !!address && !!courseId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { data, isLoading, refetch };
};
