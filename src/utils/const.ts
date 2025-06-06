export const ROUTE_PATH = {
  HOME: '/',
  COURSE_SEARCH: '/course-search',
  CREATE_COURSE: '/create-course',
  MY_LEARNING: '/my-learning',

  COURSE: '/course',
  LESSON: '/lesson',
  DETAIL_LESSON: (id: any) => `/lesson/${id}`,
  LIST_COURSE: '/list-course',
  DETAIL_COURSE: (id: any) => `/course/${id}`,

  MY_PROFILE: '/my-profile',
};

export enum TYPE_COURSE {
  LECTURE = 'LECTURE',
  QUIZ = 'QUIZ',
  END_COURSE = 'END_COURSE',
}

export enum Language {
  EN = 'EN',
}

export const DATA_LANGUAGE = [
  {
    key: Language.EN,
    label: 'English',
  },
];
export enum Level {
  BEGINNER = 'BEGINNER',
}

export const DATA_LEVEL = [
  {
    key: Level.BEGINNER,
    label: 'Beginner',
  },
];

export enum Topic {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  JAVASCRIPT = 'JAVASCRIPT',
  HTML = 'HTML',
  REACTJS = 'REACTJS',
  WORDPRESS = 'WORDPRESS',
  PHP = 'PHP',
}

export enum LessonContentType {
  VIDEO = 'VIDEO',
  VIDEO_SLIDE_MASHUP = 'VIDEO_SLIDE_MASHUP',
  ARTICLE = 'ARTICLE',
}

export const DefaultData = {
  DefaultCourseImage: '/course-detail.png',
  CourseDefaultUrl: 'https://app-lms.focalfossa.site/course',
  DefaultTitle: 'What Exchange LMS',
  DefaultDescription:
    'What Exchange platform for learning and sharing knowledge.',
  DefaultImage:
    'https://opengraph.b-cdn.net/production/images/8114e0cd-f577-4898-b01d-ee630c0b3222.png?token=OENDZ31ZgZfNQlF_kRNBMCF-QEL8lhpU6Qc0kDSmgdg&height=256&width=256&expires=33285106981',
  DefaultUrl: 'https://app-lms.focalfossa.site/',
  DefaultType: 'website',
  DefaultDomain: 'app-lms.focalfossa.site',
};
