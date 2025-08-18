import QuillEditor from '@/components/UI/QuillEditor';
import Text from '@/components/UI/Text';

const Note = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <div className="py-1 px-3 flex justify-center rounded-full items-center bg-gray">
          <Text type="font-14-400" className="text-letter">
            00:00
          </Text>
        </div>
        <QuillEditor />
      </div>
    </div>
  );
};
export default Note;
