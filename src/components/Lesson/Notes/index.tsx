import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

const Note = dynamic(() => import('./Note'), {
  ssr: false,
});

const Notes = () => {
  const { t } = useTranslation('common');
  const [openNote, setOpenNote] = useState(false);
  return (
    <div className="pt-8 flex flex-col gap-8 pl-[140px] pr-[32px]">
      {openNote ? (
        <Note />
      ) : (
        <div
          onClick={() => setOpenNote(!openNote)}
          className="cursor-pointer hover:opacity-80 transition-all p-3 border-1 border-white rounded flex justify-between items-center"
        >
          <Text type="font-16-400" className="text-black/7">
            {t('Create a new note at 0.01')}
          </Text>
          <IconAdd />
        </div>
      )}

      <div className="flex items-center gap-3">
        <SelectCustom
          placeholder={t('All lectures')}
          className="max-w-[125px]"
          isLesson
          options={[]}
        />
        <SelectCustom
          placeholder={t('Sort by most recent')}
          className="max-w-[186px]"
          isLesson
          options={[]}
        />
      </div>
    </div>
  );
};
export default Notes;

const IconAdd = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z"
        fill="white"
      />
    </svg>
  );
};
