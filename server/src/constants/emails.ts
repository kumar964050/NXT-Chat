export const EMAIL_SUBJECTS = {
  WELCOME: "Welcome to NXT-Chat 🎉",
  PASSWORD_RESET: "Password Reset Request 🔑",
  PASSWORD_RESET_SUCCESS: "Password Reset Successful ✅",
  PASSWORD_UPDATED: "Your NXT-Chat Password Was Updated 🔒",
  USER_DETAILS_UPDATED: "Your NXT-Chat Profile Was Updated ✨",
  VERIFY_EMAIL: "Verify Your Email Address 📧",
  ACCOUNT_DELETED: "Your NXT-Chat Account Has Been Deleted ❌",
} as const;

// Base wrapper with inline CSS
const baseWrapper = (content: string) => `
  <div style="
    font-family: Arial, sans-serif;
    background: #f5f7f9;
    padding: 20px;
    color: #13151a;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border: 1px solid #dbe1e9;
      border-radius: 8px;
      box-shadow: 0 2px 8px #12151814;
      padding: 20px;
    ">
      ${content}
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #dbe1e9;" />
      <p style="font-size: 12px; color: #697181; text-align: center;">
        © ${new Date().getFullYear()} NXT-Chat. All rights reserved.
      </p>
    </div>
  </div>
`;

export const EMAIL_BODIES = {
  WELCOME: (name: string) =>
    baseWrapper(`
      <h2 style="color:#7c3bec;">Hi ${name},</h2>
      <p>Welcome to <b>NXT-Chat</b> 🎉</p>
      <p>We’re excited to have you on board. Start connecting and chatting instantly.</p>
    `),

  PASSWORD_RESET: (name: string, link: string) =>
    baseWrapper(`
      <h2 style="color:#7c3bec;">Hello ${name},</h2>
      <p>We received a request to reset your NXT-Chat password.</p>
      <p>Click the button below to reset it (valid for a limited time): 20 minutes</p>
      <a href="${link}" target="_blank" 
        style="
          display:inline-block;
          margin-top:12px;
          background:#7c3bec;
          color:#ffffff;
          padding:10px 16px;
          border-radius:6px;
          text-decoration:none;
        ">
        Reset Password
      </a>
      <p style="margin-top:20px;">If you didn’t request this, you can safely ignore this email.</p>
    `),

  PASSWORD_RESET_SUCCESS: (name: string) =>
    baseWrapper(`
      <h2 style="color:#7c3bec;">Hello ${name},</h2>
      <p>Your password has been reset successfully ✅.</p>
      <p>If you didn’t make this change, please contact NXT-Chat support immediately.</p>
    `),

  PASSWORD_UPDATED: (name: string) =>
    baseWrapper(`
      <h2 style="color:#7c3bec;">Hello ${name},</h2>
      <p>Your password was successfully updated 🔒.</p>
      <p>If this wasn’t you, please change it immediately or contact our support team.</p>
    `),

  USER_DETAILS_UPDATED: (name: string) =>
    baseWrapper(`
      <h2 style="color:#7c3bec;">Hi ${name},</h2>
      <p>Your <b>NXT-Chat</b> profile details were updated ✨.</p>
      <p>If you didn’t make these changes, please review your account security settings.</p>
    `),

  VERIFY_EMAIL: (name: string, link: string) =>
    baseWrapper(`
      <h2 style="color:#7c3bec;">Hi ${name},</h2>
      <p>Thanks for signing up with <b>NXT-Chat</b>!</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${link}" target="_blank"
        style="
          display:inline-block;
          margin-top:12px;
          background:#2dc2b3;
          color:#ffffff;
          padding:10px 16px;
          border-radius:6px;
          text-decoration:none;
        ">
        Verify Email
      </a>
    `),

  ACCOUNT_DELETED: (name: string) =>
    baseWrapper(`
      <h2 style="color:#db143c;">Hi ${name},</h2>
      <p>Your <b>NXT-Chat</b> account has been permanently deleted ❌.</p>
      <p>We’re sorry to see you go. If this was a mistake, please reach out to NXT-Chat support.</p>
    `),
};
