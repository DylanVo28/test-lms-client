import { Button } from '@nextui-org/react';
import Text from '../Text';
import { useTranslation } from 'react-i18next';
import { usePrivy } from '@privy-io/react-auth';

const CustomButtonNewCourse = ({
  handleClickButton,
}: {
  handleClickButton: VoidFunction;
}) => {
  const { t } = useTranslation('common');
  const { ready, authenticated, login } = usePrivy();
  const connected = ready && authenticated;

  return (
    <div>
      {!connected ? (
        <Button
          onPress={() => {
            login();
          }}
          className="bg-main w-max min-h-[40px] rounded"
        >
          <Text className="text-letter" type="font-16-600">
            {t('common.newCourse')}
          </Text>
        </Button>
      ) : (
        <Button
          onPress={handleClickButton}
          className="bg-main w-max min-h-[40px] rounded"
        >
          <Text className="text-text-letter" type="font-16-600">
            {t('common.newCourse')}
          </Text>
        </Button>
      )}
    </div>
  );
};

export default CustomButtonNewCourse;
