import ListCourse from './ListCourse';
import MainBanner from './MainBanner';

const Course = () => {
  return (
    <div className="flex flex-col gap-16">
      <MainBanner />
      <ListCourse />
    </div>
  );
};
export default Course;
