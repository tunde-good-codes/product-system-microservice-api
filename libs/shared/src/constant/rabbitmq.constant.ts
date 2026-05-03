export const RABBITMQ_QUEUES = {
  AUTH: "auth_queue",
  CATALOG: "catalog_queue",
  MEDIA: "media_queue",
};

export const AUTH_MESSAGE_PATTERNS = {
  LOGIN: "auth.login",
  REGISTER: "auth.register",
  VALIDATE_TOKEN: "auth.validate_token",
  REFRESH_TOKEN: "auth.refresh_token",
  LOGOUT: "auth.logout",
};
