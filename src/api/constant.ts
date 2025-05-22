export const API_PATH = {
  // Auth
  AUTH_LOGIN: '/api/admin/auth/login',
  REGISTER_USER: '/api/auth/register',
  VERIFY_REFERRAL_CODE: '/api/auth/verify-referral-code',
  ADD_ORDERLY_KEY: '/api/auth/add-orderly-key',
  BIND_REFERRAL_CODE: '/api/auth/bind-referral-code',
  GET_USER_VOLUMN: '/api/referral/get-user-volumn',

  CHECK_ADDRESS: '/api/auth/check-address',

  LOGOUT: '/api/auth/logout',

  GET_USER: '/api/users/me',

  GET_NONCE: '/api/auth/nonce',

  LOGIN_WEB3: '/api/auth/login-web3',

  CATEGORIES: '/api/categories',

  SUB_CATEGORIES: `/api/subcategories`,

  LIST_CERTIFICATES: '/api/certificates/my-list',

  CREATE_COURSE: '/api/courses',
  REMOVE_LIKE_COMMENT: (id: string) => `/api/courses/comments/reactions/${id}`,
  LIKE_COMMENT: (id: string) => `/api/courses/comments/${id}/reaction`,
  LIKE_REVIEW: `/api/courses/reactions`,
  EDIT_COURSE: (id: string) => `/api/courses/${id}`,

  LIKE_COURSE: (id: string) => `/api/courses/${id}/like`,
  COMMENT_COURSE: (id: string) => `/api/courses/${id}/comment`,
  REVIEW_COURSE: (id: string) => `/api/courses/${id}/review`,

  LIST_COMMENT: (id: string) => `/api/courses/${id}/comments`,
  UN_LIKE_COMMENT: (id: string) => `/api/courses/reactions/${id}`,
  LIST_REVIEW: (id: string) => `/api/courses/${id}/reviews`,
  LIST_REVIEW_SUMMARY: (id: string) => `/api/courses/${id}/reviews/summary`,
  LIST_COURSE: '/api/courses',

  MY_COURSE: '/api/courses/my-courses',

  MY_LEARNINGS: '/api/courses/my-learnings',

  SECTIONS: '/api/sections',

  LECTURE: '/api/lessons',

  QUIZZ: '/api/quizzes',

  UPLOAD_FILE: '/api/storage/upload',

  UPLOAD_FILE_IN_BACKGROUND: '/api/storage/upload-in-background',

  FILTER_PRICE: '/api/filters/price',

  CLAIM_CERTIFICATES: '/api/certificates/claim',

  MINT_CERTIFICATE: '/api/web3/mintNFT',

  FILTER_TOPIC: '/api/filters/topic',

  FILTER_LEVEL: '/api/filters/level',

  FILTER_LANGUAGE: '/api/filters/language',

  FILTER_VIDEO_DURATION: '/api/filters/video-duration',

  FILTER_RATING: '/api/filters/rating',

  FILTER_FEATURES: '/api/filters/features',

  QUESTION_QUIZZ: (id: string) => `/api/quizzes/${id}/question`,

  EDIT_QUESTION_QUIZZ: (id: string) => `/api/quizzes/questions/${id}`,

  ENROLL_COURSE: (id: string) => `/api/courses/${id}/enroll`,

  PROGRESS_QUIZZ: (id: string) => `/api/quizzes/${id}/progress`,

  PROGRESS_LESSON: (id: string) => `/api/lessons/${id}/progress`,

  USER_ME: '/api/users/me',
  USER_UPDATE: '/api/users',

  USER_DETAIL: (id: string) => `/api/users/${id}`,

  REFERRAL_SUMMARY: '/api/referral/summary',
  REFERRAL_PROFILE: '/api/referral/profile',

  WISH_LISH: '/api/courses/wishlist',

  LIST_FOLLOWER: '/api/users/followings',

  FOLLOW_MENTOR: (id: string) => `/api/users/${id}/follow`,
  UN_FOLLOW_MENTOR: (id: string) => `/api/users/${id}/unfollow`,
  THEMES: '/api/themes',
  THEME_DETAIL: '/api/themes/detail',

  FCM_TOKEN: '/api/fcm',

  NOTIFICATION: '/api/notifications',

  GET_COUNT_NOTIFICATION: '/api/notifications/count',

  READ_NOTIFICATION: (id: string) => `/api/notifications/${id}/read`,

  GET_WITHDRAW_METADATA: '/api/web3/get-metadata',
  UPDATE_KOL_REWARD: '/api/user/update-reward',
  YOUR_NETWORK: '/api/courses/your-network',
  REWARD_HISTORY: '/api/users/reward-history',
};
