import { toast } from '@/components/UI/Toast/toast';
import { useTranslation } from 'next-i18next';

const useCopy = () => {
  const { t } = useTranslation('common');

  const onCopy = (text?: string) => {
    window.navigator.clipboard.writeText(text || '');
    toast.success(t('Copied!'));
  };

  return { onCopy };
};

export default useCopy;
