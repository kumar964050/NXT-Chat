export const EMAIL_SUBJECTS = {
  WELCOME: "Welcome to NXT-Chat 🎉",
  PASSWORD_RESET: "Password Reset Request 🔑",
  PASSWORD_RESET_SUCCESS: "Password Reset Successful ✅",
  VERIFY_EMAIL: "Verify Your Email Address 📧",
  ACCOUNT_DELETED: "Your NXT-Chat Account Has Been Deleted ❌",
};

export const EMAIL_BODIES = {
  WELCOME: (name: string) => `
    <h2>Hi ${name},</h2>
    <p>Welcome to <b>NXT-Chat</b>! 🎉</p>
    <p>We’re excited to have you on board. Start connecting and chatting instantly.</p>
  `,

  PASSWORD_RESET: (name: string, link: string) => `
    <h2>Hello ${name},</h2>
    <p>We received a request to reset your NXT-Chat password.</p>
    <p>Click the link below to reset it (valid for a limited time):</p>
    <a href="${link}" target="_blank">${link}</a>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  `,

  PASSWORD_RESET_SUCCESS: (name: string) => `
    <h2>Hello ${name},</h2>
    <p>Your password has been reset successfully ✅.</p>
    <p>If you didn’t make this change, please contact NXT-Chat support immediately.</p>
  `,

  VERIFY_EMAIL: (name: string, link: string) => `
    <h2>Hi ${name},</h2>
    <p>Thanks for signing up with <b>NXT-Chat</b>!</p>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${link}" target="_blank">Verify Email</a>
  `,

  ACCOUNT_DELETED: (name: string) => `
    <h2>Hi ${name},</h2>
    <p>Your <b>NXT-Chat</b> account has been permanently deleted ❌.</p>
    <p>We’re sorry to see you go. If this was a mistake, please reach out to NXT-Chat support.</p>
  `,
};
