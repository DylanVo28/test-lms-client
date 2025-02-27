import { useParams } from 'next/navigation';
import ListCourse from './ListCourse';
import MainBanner from './MainBanner';

const Course = () => {
  const params = useParams<{ tag: string; item: string }>();

  console.log('params', params);

  return (
    <div className="flex flex-col gap-16">
      <MainBanner />
      <ListCourse />
    </div>
  );
};
export default Course;
