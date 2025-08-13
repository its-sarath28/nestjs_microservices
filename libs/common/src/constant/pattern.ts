export const PATTERN = {
  AUTH: {
    REGISTER: { cmd: 'register' },
    LOGIN: { cmd: 'login' },
  },
  USER: {
    FIND_BY_EMAIL: { cmd: 'find_by_email' },
    FIND_BY_ID: { cmd: 'find_by_id' },
    CREATE_USER: { cmd: 'create_user' },
    UPDATE_REFRESH_TOKEN: { cmd: 'update_refresh_token' },
    UPDATE_BLOG_COUNT: { cmd: 'update_blog_count' },
  },
  BLOG: {
    CREATE_BLOG: { cmd: 'create_blog' },
    UPDATE_BLOG: { cmd: 'update_blog' },
    FIND_BY_ID: { cmd: 'find_by_id' },
    FIND_ALL: { cmd: 'find_all' },
    REMOVE_BLOG: { cmd: 'remove_blog' },
    UPDATE_LIKE_COUNT: { cmd: 'update_like_count' },
    UPDATE_COMMENT_COUNT: { cmd: 'update_comment_count' },
  },
  INTERACTION: {
    CREATE_COMMENT: { cmd: 'create_comment' },
    REMOVE_COMMENT: { cmd: 'remove_comment' },
    UPDATE_COMMENT: { cmd: 'update_comment' },
    COMMENTS_OF_BLOG: { cmd: 'comments_of_blog' },
    UPDATE_LIKE: { cmd: 'update_like' },
    TOGGLE_FOLLOW: { cmd: 'toggle_follow' },
  },
  SOCKET: {
    NOTIFY_NEW_COMMENT: { cmd: 'new_comment' },
  },
};
