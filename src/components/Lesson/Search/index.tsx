import IconSearch from '@/components/UI/Icons/IconSearch';
import InputText from '@/components/UI/InputText';
import { Button } from '@nextui-org/react';

const Search = () => {
  return (
    <div className="pt-8 flex flex-col gap-6 min-h-[100px] md:px-[80px] md:w-10/12 mx-auto">
      <div className="flex items-center gap-2 w-full">
        <div className="w-full">
          <InputText
            className="md:min-w-[500px]"
            isLesson
            placeholder="Search"
          />
        </div>
        <Button
          isIconOnly
          className="rounded bg-gray min-h-[44px] min-w-[50px]"
        >
          <IconSearch />
        </Button>
      </div>
    </div>
  );
};
export default Search;
