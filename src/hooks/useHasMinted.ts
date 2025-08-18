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
    queryFn: () => contract?.hasMinted(address, courseId),
  });

  return { data, isLoading, refetch };
};
