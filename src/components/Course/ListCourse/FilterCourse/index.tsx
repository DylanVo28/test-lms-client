import AccordionCustom from '@/components/UI/AccordionCustom';

const FilterCourse = () => {
  return (
    <div className="flex flex-col gap-5 ml-[-8px]">
      <AccordionCustom title="Rating">1</AccordionCustom>
      <AccordionCustom title="Language">2</AccordionCustom>
      <AccordionCustom title="Practical">3</AccordionCustom>
      <AccordionCustom title="Video duration">4</AccordionCustom>
    </div>
  );
};
export default FilterCourse;
