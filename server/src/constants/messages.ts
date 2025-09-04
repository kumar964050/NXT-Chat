// success messages
export const SUCCESS_MESSAGES = {
  // User

  USER_CREATED: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  PASSWORD_CHANGED: "Password changed successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  ACCOUNT_DELETED: "Account deleted successfully",

  // Notifications
  NOTIFICATION_SENT: "Notification sent successfully",
};

// error messages
export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later",
  UNAUTHORIZED: "You are not authorized to perform this action",
  FORBIDDEN: "Access denied",
  BAD_REQUEST: "Invalid request data",

  // User
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_ALREADY_EXISTS: "Email/username already exists",
  ACCOUNT_NOT_ACTIVE: "Your account is not active",

  // Notifications
  NOTIFICATION_FAILED: "Failed to send notification",
};
