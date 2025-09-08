const EditLessonToastContent = ({
  editLessonId,
  dataCurriculum,
}: {
  editLessonId: string | null;
  dataCurriculum: any[];
}) => {
  const lesson = dataCurriculum.find((item: any) => item.id === editLessonId);

  return (
    <div>
      <div className="text-sm font-normal text-letter/40 line-clamp-2 mt-0.5">
        Lesson
        <span className="font-bold px-1">{lesson?.title || 'Unknown'}</span>
        is being edited
      </div>
      <div className="text-sm font-normal text-letter/40 line-clamp-2 mt-0.5">
        Please save it before editing a question
      </div>
    </div>
  );
};

export default EditLessonToastContent;
