import Info from '@/components/UI/Icons/Info';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import useCopy from '@/hooks/useCopy';
import { MINT_NFT_ADDRESS } from '@/hooks/useHasMinted';
import CopyIcon from '@/icons/CopyIcon';
import { Button, Tooltip } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useMintCertificate } from '../service';
import ImageCustom from "@/components/UI/ImageCustom";

const MINTING_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const MINTING_COUNTDOWN = 10 * 1000; // 10 seconds in milliseconds

const CertificationItem = ({ item, refetchCertificates }: any) => {
  const { t } = useTranslation('common');
  const [isMintingInProgress, setIsMintingInProgress] = useState(false);

  const checkMintingStatus = () => {
    const mintingRecord = localStorage.getItem(`minting_${item.id}`);
    if (mintingRecord) {
      const mintingTime = parseInt(mintingRecord);
      if (Date.now() - mintingTime > MINTING_TIMEOUT) {
        localStorage.removeItem(`minting_${item.id}`);
        return false;
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    setIsMintingInProgress(checkMintingStatus());
  }, [item.id]);

  const { mutate: handleMintCertificate, isPending: isMinting } = useMintCertificate(
    {
      onSuccess(res) {
        localStorage.removeItem(`minting_${item.id}`);
      },
      onError(e: any) {
        if (e?.message?.includes('Already minted for this course')) {
          toast.error(t('myLearning.certifications.alreadyMinted'));
        } else {
          toast.error(e?.message);
        }
        localStorage.removeItem(`minting_${item.id}`);
      },
    }
  );

  const account = useAccount();
  const { address: walletAddress } = account;

  const handleMint = () => {
    if (!walletAddress) {
      toast.error(t('errors.connectWallet'));
      return;
    }

    if (localStorage.getItem(`minting_countdown`)) {
      const mintCountdown = new Date(
        localStorage.getItem(`minting_countdown`) || 0
      );
      if (mintCountdown.getTime() > Date.now()) {
        toast.error(t('You are minting too fast'));
        return;
      }
    }

    const mintCountdown = new Date(Date.now() + MINTING_COUNTDOWN);
    localStorage.setItem(`minting_${item.id}`, Date.now().toString());
    localStorage.setItem(`minting_countdown`, mintCountdown.toString());

    setIsMintingInProgress(true);
    handleMintCertificate({
      to: walletAddress?.toString(),
      certificateId: item.certificate.id,
    });
  };

  const { onCopy } = useCopy();

  return (
    <div
      key={item?.id}
      className="rounded border-1 border-white-10 bg-card p-4 flex items-center gap-3"
    >
      <ImageCustom
        src={item?.certificate?.image}
        alt=""
        width={140}
        height={140}
        className="w-[140px] h-[140px] object-cover"
        onError={(e: any) => {
          e.target.srcset = '/images/img-certification.png';
        }}
      />

      <div className="flex flex-col gap-3">
        <Text
          type="font-16-600"
          className="text-letter line-clamp-2 min-h-[48px]"
        >
          {item?.certificate?.name}
        </Text>
        <Text type="font-14-400" className="text-letter line-clamp-2">
          {item?.certificate?.description}
        </Text>
        {!item.tokenId && walletAddress && (
          <>
            <Button
              onPress={handleMint}
              isLoading={isMinting}
              isDisabled={isMintingInProgress}
              className="w-fit"
            >
              <Text type="font-16-600" className="text-main">
                {t('myLearning.certifications.mint')}
              </Text>
            </Button>
          </>
        )}

        {isMintingInProgress && !item.tokenId && (
          <div className="flex items-center gap-2">
            <Text type="font-14-400" className="text-main">
              {t('myLearning.certifications.minting')}
            </Text>
          </div>
        )}

        {item.tokenId && (
          <div className="flex gap-x-2 items-center">
            <div className="text-main">
              {t('myLearning.certifications.alreadyMinted')}
            </div>
            <div>
              <div>
                <Tooltip
                  content={
                    <div className="flex flex-col items-start gap-2 p-2">
                      <div>View on BaseScan:</div>
                      <div className="flex gap-x-1 items-center">
                        {t('myLearning.certifications.contract')}:{' '}
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
                        {t('myLearning.certifications.tokenId')}:{' '}
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
                  <div className="text-letter font-semibold text-sm">
                    <Info size={16} className="text-main" color="#818181" />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationItem;
