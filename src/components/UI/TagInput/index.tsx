import Plus from '@/components/UI/Icons/Plus';
import React, { useState, useRef } from 'react';
import Text from '../Text';
import { atom, useAtom } from 'jotai';

export const topicsAtom = atom<any>([]);

const TagInput = () => {
  const [topics, setTopics] = useAtom(topicsAtom);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef: any = useRef(null);

  const handleClose = (removedTag: any) => {
    const newTags = topics.filter((tag: any) => tag !== removedTag);
    setTopics(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && topics.indexOf(inputValue) === -1) {
      setTopics([...topics, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleInputConfirm();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center p-5 border border-[#00000033] rounded-[4px] bg-gray-50">
      {topics?.map((tag: any) => (
        <div
          key={tag}
          className="rounded-full bg-card capitalize border-1 gap-2 border-white-10 py-2 px-3 flex justify-center items-center"
        >
          {tag}
          <span
            onClick={() => handleClose(tag)}
            className="cursor-pointer hover:bg-black-7 rounded-full h-4 w-4 flex items-center justify-center"
          >
            ×
          </span>
        </div>
      ))}

      {inputVisible ? (
        <input
          ref={inputRef}
          type="text"
          className="outline-none border border-main rounded-md px-3 py-2 max-w-[120px]"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onKeyDown={handleInputKeyDown}
        />
      ) : (
        <button
          onClick={showInput}
          className="border group border-dashed max-h-[32px] rounded-md border-black-7 px-3 py-2 hover:text-main hover:border-main"
        >
          <div className="flex items-center gap-2">
            <Text
              type="font-12-400"
              className="text-letter group-hover:text-main"
            >
              +
            </Text>
            <Text
              type="font-12-400"
              className="text-letter group-hover:text-main"
            >
              New topic
            </Text>
          </div>
        </button>
      )}
    </div>
  );
};

export default TagInput;
