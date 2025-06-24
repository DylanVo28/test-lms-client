import { createContext, useContext, useState } from 'react';

interface CurriculumContextInterface {
  dataCurriculum: any;
  setDataCurriculum: (data: any) => void;
  // editLessonId: string | null;
  handleUpdateEditLessonId: (id: string | null) => void;
  // showBoundingBox: boolean;
  handleUpdateShowBoundingBox: (show: boolean) => void;
}
const CurriculumContext = createContext<CurriculumContextInterface>({
  dataCurriculum: [],
  setDataCurriculum: () => {},
  // editLessonId: null,
  handleUpdateEditLessonId: () => {},
  // showBoundingBox: false,
  handleUpdateShowBoundingBox: () => {},
});

const CurriculumProvider = ({ children }: any) => {
  const [dataCurriculum, setDataCurriculum] = useState<any>([]);
  const [editLessonId, seteditLessonId] = useState<string | null>(null);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(false);

  const handleUpdateEditLessonId = (id: string | null) => {
    seteditLessonId(id);
  };

  const handleUpdateShowBoundingBox = (show: boolean) => {
    setShowBoundingBox(show);
  };

  return (
    <CurriculumContext.Provider
      value={{
        dataCurriculum,
        setDataCurriculum,
        // editLessonId,
        handleUpdateEditLessonId,
        // showBoundingBox,
        handleUpdateShowBoundingBox,
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
};

export default CurriculumProvider;

export const useCurriculumContext = () => {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
};
