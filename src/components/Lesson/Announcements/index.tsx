import Text from '@/components/UI/Text';
const Announcements = () => {
  return (
    <div className="pt-2 flex flex-col gap-1 pl-[80px] pr-[32px]">
      <Text className="text-white" type="font-18-600">
        {'No announcements posted yet'}
      </Text>
      <Text className="text-black-7" type="font-14-400">
        {'The instructor hasn’t added any announcements to this course yet. Announcements are used to inform you of updates or additions to the course.'}
      </Text>
    </div>
  );
};
export default Announcements;
