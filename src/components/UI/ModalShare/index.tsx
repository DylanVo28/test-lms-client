/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import { Copy, XLogo } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

interface IModalShare {
  courseSlug: string;
}

const ModalShare = ({ courseSlug }: IModalShare, ref?: any) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useImperativeHandle(ref, () => {
    return {
      onOpen: (id: string) => {
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });
  const onVisible = () => {
    setVisible(!visible);
  };

  const host = window.location.host;
  const shareUrl = `${host}/${router.query.code}/course/${courseSlug}`;

  const onCopy = () => {
    window.navigator.clipboard.writeText(shareUrl);
    toast.success('Copied!');
  };

  return (
    <CustomModal
      placementMoblie="center"
      size="2xl"
      isOpen={visible}
      onClose={onVisible}
      className="max-w-[500px]"
    >
      <div className="bg-[#0E0E0E] rounded-xl p-6 border-2 border-[rgba(255,255,255,0.05)] shadow-[0px_4px_0px_0px_rgba(255,255,255,0.05)]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <Text className="text-white text-2xl font-semibold tracking-[-0.03em]">
              Share This Course
            </Text>
            <Text className="text-white/60 text-sm">
              Share this course with your friends
            </Text>
          </div>
          <button
            onClick={onVisible}
            className="text-white/80 hover:opacity-85 active:scale-[98%] hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Referral Link Section */}
          <div className="flex flex-col gap-3">
            <Text className="text-white font-medium">Referral Link</Text>
            <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg border border-[rgba(255,255,255,0.1)]">
              <div className="flex-1 text-white/80 text-sm font-mono truncate">
                {shareUrl.length > 46
                  ? `${shareUrl.slice(0, 46)}...`
                  : shareUrl}
              </div>
              <Button
                onPress={onCopy}
                className="flex items-center justify-center p-2 rounded-md bg-[#323232] hover:bg-[#404040] transition-colors min-w-8 h-8"
                size="sm"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share to Section */}
          <div className="flex flex-col gap-4">
            <Text className="text-white font-medium">Share to</Text>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
              {/* Twitter */}
              <div className="flex flex-col items-center gap-2">
                <TwitterShareButton url={shareUrl}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] hover:opacity-80 transition-opacity">
                    <XLogo className="text-white" size={20} />
                  </div>
                </TwitterShareButton>
                <span className="text-xs text-white">Twitter</span>
              </div>

              {/* Telegram */}
              <div className="flex flex-col items-center gap-2">
                <TelegramShareButton url={shareUrl}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0088cc] hover:opacity-80 transition-opacity">
                    <TelegramIcon />
                  </div>
                </TelegramShareButton>
                <span className="text-xs text-white">Telegram</span>
              </div>

              {/* Facebook */}
              <div className="flex flex-col items-center gap-2">
                <FacebookShareButton url={shareUrl}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:opacity-80 transition-opacity">
                    <IconFacebook />
                  </div>
                </FacebookShareButton>
                <span className="text-xs text-white">Facebook</span>
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col items-center gap-2">
                <WhatsappShareButton url={shareUrl}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:opacity-80 transition-opacity">
                    <WhatsAppIcon />
                  </div>
                </WhatsappShareButton>
                <span className="text-xs text-white">WhatsApp</span>
              </div>

              {/* Reddit */}
              <div className="flex flex-col items-center gap-2">
                <RedditShareButton url={shareUrl}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF4500] hover:opacity-80 transition-opacity">
                    <RedditIcon />
                  </div>
                </RedditShareButton>
                <span className="text-xs text-white">Reddit</span>
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col items-center gap-2">
                <LinkedinShareButton url={shareUrl}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0077B5] hover:opacity-80 transition-opacity">
                    <LinkedInIcon />
                  </div>
                </LinkedinShareButton>
                <span className="text-xs text-white">Linkedin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default forwardRef(ModalShare);

const CloseIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.3333 16.0013C29.3333 23.3651 23.3638 29.3346 16 29.3346C8.63616 29.3346 2.66663 23.3651 2.66663 16.0013C2.66663 8.63751 8.63616 2.66797 16 2.66797C23.3638 2.66797 29.3333 8.63751 29.3333 16.0013ZM11.9595 11.9608C12.35 11.5703 12.9832 11.5703 13.3737 11.9608L15.9999 14.5871L18.6261 11.9609C19.0167 11.5703 19.6498 11.5703 20.0403 11.9609C20.4309 12.3514 20.4309 12.9846 20.0403 13.3751L17.4141 16.0013L20.0403 18.6275C20.4308 19.018 20.4308 19.6512 20.0403 20.0417C19.6498 20.4322 19.0166 20.4322 18.6261 20.0417L15.9999 17.4155L13.3737 20.0417C12.9832 20.4322 12.35 20.4322 11.9595 20.0417C11.569 19.6512 11.569 19.018 11.9595 18.6275L14.5857 16.0013L11.9595 13.375C11.5689 12.9845 11.5689 12.3514 11.9595 11.9608Z"
        fill="url(#paint0_linear_876_55093)"
        fillOpacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_876_55093"
          x1="16"
          y1="2.66797"
          x2="16"
          y2="29.3346"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#999999" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const EmbedIcon = () => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 8.66797L23.8334 13.0013L19.5 17.3346M6.50002 8.66797L2.16669 13.0013L6.50002 17.3346"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const IconFacebook = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
    >
      <path
        d="M10.6802 11.2493L11.2501 7.63143H7.73942V5.27982C7.73942 4.29056 8.22955 3.32391 9.79683 3.32391H11.4154V0.243075C10.4728 0.0929007 9.5204 0.0116567 8.56581 0C5.67631 0 3.78987 1.73544 3.78987 4.87281V7.63143H0.586914V11.2493H3.78987V20H7.73942V11.2493H10.6802Z"
        fill="white"
      />
    </svg>
  );
};

const TelegramIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
        fill="white"
      />
    </svg>
  );
};

const WhatsAppIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"
        fill="white"
      />
    </svg>
  );
};

const RedditIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
        fill="white"
      />
    </svg>
  );
};

const LinkedInIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="white"
      />
    </svg>
  );
};
