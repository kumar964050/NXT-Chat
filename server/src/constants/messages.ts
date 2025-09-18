// success messages
export const SUCCESS_MESSAGES = {
  // Auth
  USER_CREATED: "Your account has been created successfully.",
  LOGIN_SUCCESS: "You have logged in successfully.",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
  TOKEN_REFRESHED: "Authentication token refreshed successfully.",
  FORGOT_PASSWORD_EMAIL_SENT:
    "Password reset instructions have been sent to your registered email address.",
  PASSWORD_CHANGED: "Your password has been updated successfully.",
  PASSWORD_RESET: "Your password has been reset successfully.",
  PROFILE_UPDATED: "Your profile has been updated successfully.",
  ACCOUNT_DELETED: "Your account has been deleted successfully.",

  // Users
  USERS_FETCHED: "Users fetched successfully.",
  USER_PROFILE_FETCHED: "User profile fetched successfully.",
  MY_PROFILE_FETCHED: "Your profile fetched successfully.",
  USER_PROFILE_UPDATED: "Profile updated successfully.",
  PROFILE_IMAGE_UPDATED: "Profile image updated successfully.",
  PROFILE_IMAGE_REMOVED: "Profile image removed successfully.",

  // Messages
  MESSAGE_SENT: "Message sent successfully.",
  MESSAGES_FETCHED: "Messages fetched successfully.",
  MESSAGE_DELETED: "Message deleted successfully.",
  MESSAGE_UPDATED: "Message updated successfully.",
  MESSAGE_STATUS_UPDATED: "Message status updated successfully.",

  // Attachments
  FILE_UPLOADED: "File uploaded successfully.",

  // Notifications
  NOTIFICATION_SENT: "Notification delivered successfully.",

  // General
  REQUEST_SUCCESS: "Request completed successfully.",
};

// error messages
export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR:
    "An unexpected error occurred. Please try again later.",
  UNAUTHORIZED: "Authentication required. Please log in.",
  TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  INVALID_TOKEN: "Authentication token is invalid. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  BAD_REQUEST: "The request could not be processed due to invalid input.",

  // Auth / User
  USER_NOT_FOUND: "No account was found with the provided details.",
  INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
  USER_ALREADY_EXISTS: "An account with this email or username already exists.",
  ACCOUNT_NOT_ACTIVE: "Your account is not active. Please contact support.",
  EMAIL_NOT_VERIFIED:
    "Your email address is not verified. Please verify to continue.",
  EMAIL_ALREADY_EXISTS: "Email is already in use.",
  USERNAME_ALREADY_EXISTS: "Username is already in use.",
  PROFILE_IMAGE_REQUIRED: "Please provide a profile image.",
  MESSAGE_FILE_REQUIRED: "Please provide a message attachment.",
  PROFILE_IMAGE_UPLOAD_FAILED: "Failed to upload profile image.",

  // Password
  INCORRECT_CURRENT_PASSWORD: "Incorrect current password.",
  PASSWORD_REQUIRED: "Current password and new password are required.",
  PASSWORD_MIN_LENGTH: "New password must be at least 8 characters long.",
  PASSWORD_RESET_FAILED: "Failed to reset password. Please request a new link.",
  RESET_TOKEN_INVALID: "The reset token is invalid or has expired.",

  // Notifications
  NOTIFICATION_FAILED: "Unable to send notification. Please try again later.",
};
