import RadioCustom from '@/components/UI/RadioCustom';
import Text from '@/components/UI/Text';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  RadioGroup,
  Radio,
} from '@nextui-org/react';

import languages from '../ThemeConfiguration/data/languages.json';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { useState } from 'react';

export default function LanguageModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { profile, setProfile } = useProfileInitial();
  const [langSelected, setLangSelected] = useState('');
  const onChangeRadioGroup = (e: any) => {
    setLangSelected(e.target.value);
  };
  const onSave = () => {
    if (langSelected) setProfile({ ...profile, langSelected });
  };
  return (
    <>
      <div
        onClick={onOpen}
        className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green/10"
      >
        <Text type="font-14-500" className="text-white">
          {languages.find((lang) => lang.code === profile.langSelected)?.name}
        </Text>

        <Image
          src={'/images/img-arrow-right.png'}
          width={20}
          height={20}
          alt=""
        />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Language
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  color="default"
                  onChange={onChangeRadioGroup}
                  value={langSelected || profile.langSelected}
                >
                  {profile.langs.map((code) => {
                    return (
                      <Radio key={code} value={code}>
                        {languages.find((lang) => lang.code === code)?.name}
                      </Radio>
                    );
                  })}
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="rounded-md"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  className="bg-main rounded-md"
                  color="primary"
                  onPress={() => {
                    onSave();
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
