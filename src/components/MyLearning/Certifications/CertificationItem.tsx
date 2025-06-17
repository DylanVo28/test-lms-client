import Text from '@/components/UI/Text';
import { MINT_NFT_ADDRESS, useHasMinted } from '@/hooks/useHasMinted';
import { Button, Skeleton, Tooltip } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { Copy, Info } from '@phosphor-icons/react';
import CopyIcon from '@/icons/CopyIcon';
import useCopy from '@/hooks/useCopy';

const CertificationItem = ({ item, handleMintCertificate, isMinting }: any) => {
  const { t } = useTranslation('common');

  const account = useAccount();
  const { address: walletAddress } = account;

  const { data: hasMinted, isLoading } = useHasMinted({
    address: walletAddress,
    courseId: item?.certificate?.courseId,
  });

  const { onCopy } = useCopy();

  return (
    <div
      key={item?.id}
      className="rounded border-1 border-white-10 bg-white-10 p-4 flex items-center gap-3"
    >
      <Image
        src={item?.certificate?.image}
        alt=""
        width={240}
        height={120}
        className="w-[240px] h-[120px] object-cover"
        onError={(e: any) => {
          e.target.srcset = '/images/img-certification.png';
        }}
      />

      <div className="flex flex-col gap-3">
        <Text type="font-18-600" className="text-white line-clamp-2">
          {item?.certificate?.name}
        </Text>
        <Text type="font-16-400" className="text-black-7">
          {item?.certificate?.description}
        </Text>
        {!hasMinted && !isLoading && walletAddress && (
          <Button
            onPress={() =>
              handleMintCertificate({
                to: walletAddress.toString(),
                certificateId: item.certificate.id,
              })
            }
            isLoading={isMinting}
          >
            <Text type="font-16-600" className="text-main">
              Mint
            </Text>
          </Button>
        )}

        {hasMinted && (
          <div className="flex gap-x-2 items-center">
            <div className="text-main">
              You have already minted this certificate
            </div>
            <div>
              {item.tokenId && (
                <div>
                  <Tooltip
                    content={
                      <div className="flex flex-col items-start gap-2 p-2">
                        <div>
                          To import this certificate to MetaMask, go to MetaMask
                          → NFTs → Add NFT → Enter:
                        </div>
                        <div className="flex gap-x-1 items-center">
                          Contract:{' '}
                          <code className="text-main">{MINT_NFT_ADDRESS}</code>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              onCopy(MINT_NFT_ADDRESS);
                            }}
                          >
                            <CopyIcon />
                          </div>
                        </div>
                        <div className="flex gap-x-1 items-center">
                          Token ID:{' '}
                          <code className="text-main">{item.tokenId}</code>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              onCopy(item.tokenId);
                            }}
                          >
                            <CopyIcon />
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="text-white font-semibold text-sm">
                      <Info size={16} className="text-main" color="#818181" />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && <Skeleton className="w-full h-[40px] rounded-md" />}
      </div>
    </div>
  );
};

export default CertificationItem;
