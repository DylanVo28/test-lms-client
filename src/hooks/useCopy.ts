import { toast } from '@/components/UI/Toast/toast';

const useCopy = () => {
  const onCopy = (text?: string) => {
    window.navigator.clipboard.writeText(text || '');
    toast.success('Copied!');
  };

  return { onCopy };
};

export default useCopy;
