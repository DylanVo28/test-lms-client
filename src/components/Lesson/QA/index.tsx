import { IconArrowUp } from '@/components/UI/AccordionCustom';
import Text from '@/components/UI/Text';
import { Accordion, AccordionItem } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
const DATA_CONTENT = [
  {
    id: 1,
    label: 'How fast is your turnaround time?',
    contet:
      'If you’ve sent us an existing PR or article then if your content is urgent we can start publishing your content across a number of languages in a matter of hours.',
  },
  {
    id: 2,
    label: 'Do you offer guaranteed results?',
    contet:
      'If you’ve sent us an existing PR or article then if your content is urgent we can start publishing your content across a number of languages in a matter of hours.',
  },
  {
    id: 3,
    label: 'Why should I trust you?',
    contet:
      'If you’ve sent us an existing PR or article then if your content is urgent we can start publishing your content across a number of languages in a matter of hours.',
  },
  {
    id: 4,
    label: 'What languages/countries do you provide PRs in?',
    contet:
      'If you’ve sent us an existing PR or article then if your content is urgent we can start publishing your content across a number of languages in a matter of hours.',
  },
];

const QA = () => {
  const [currentKey, setCurrentKey] = useState('1');
  const onSelectionChange = (value: any) => {
    setCurrentKey(value.currentKey);
  };
  return (
    <div className="pt-8 flex flex-col gap-6 pl-[80px] pr-[64px]">
      <div className="flex flex-col gap-2">
        <Text type="font-18-600" className="text-letter">
          {'Frequently Asked Questions'}
        </Text>
        <Text type="font-16-400" className="text-black-7">
          {
            'If you’ve sent us an existing PR or article then if your content is urgent we can start publishing your content across a number of languages in a matter of hours.'
          }
        </Text>
      </div>
      <div className="mx-[-8px] ">
        <Accordion
          onSelectionChange={onSelectionChange}
          defaultExpandedKeys={['1']}
          itemClasses={{
            base: 'bg-[#181F25] rounded shadow-custom pb-4',
            trigger: '!pt-4 py-0',
            title: 'text-[20px] text-letter/70 font-semibold',
          }}
          variant="splitted"
        >
          {DATA_CONTENT?.map((item) => {
            return (
              <AccordionItem
                indicator={<IconArrowUp />}
                classNames={{
                  content: '!py-0 !pt-[10px]',
                  indicator: 'data-[open=true]:rotate-180',
                }}
                key={item?.id}
                title={
                  <Text
                    type="font-20-600"
                    className={clsx('text-letter/70', {
                      ['!text-main']: item?.id === Number(currentKey),
                    })}
                  >
                    {item?.label}
                  </Text>
                }
              >
                <Text type="font-16-400" className="text-black-2">
                  {item?.contet}
                </Text>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};
export default QA;
