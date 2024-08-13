const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authEndpoints = {
  SIGNUP_API: `${BASE_URL}/user/register`,
  LOGIN_API: `${BASE_URL}/user/login`,
  LOGOUT_API: `${BASE_URL}/user/logout`,
};

export const userEndpoints = {
  GET_ALL_USERS: `${BASE_URL}/user/getAllUsers`,
  GET_NOTIFICATIONS: `${BASE_URL}/user/getNotifications`,
  SEND_FRIEND_REQUEST: `${BASE_URL}/user/sendFriendRequest`,
  GET_MY_FRIENDS: `${BASE_URL}/user/getMyFriends`,
  RESET_PASSWORD_TOKEN: `${BASE_URL}/user/resetPassword`,
  UPDATE_PASSWORD: `${BASE_URL}/user/updatePassword`,
  GET_MY_PROFILE: `${BASE_URL}/user/me`,
};

export const chatEndpoints = {
  GET_ALL_CHATS_API: `${BASE_URL}/chat/getAllChats`,
  SEND_ATTACHMENTS: `${BASE_URL}/chat/sendAttachments`,
};
