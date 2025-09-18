# NXT-Chat

NXT-Chat is a modern, real-time chat application designed for seamless communication. Built with **React**, **TypeScript**, **Vite**, **Node.js**, **Express**, and **MongoDB**, it offers robust features including authentication, direct messaging, media uploads, and audio/video calls.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Folder Overview](#folder-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Authentication:** User registration, login, password reset, and account management.
- **Real-time Messaging:** One-to-one chat with support for text, emojis, and media attachments.
- **Audio & Video Calls:** Peer-to-peer calling powered by WebRTC.
- **Notifications:** Instant notifications for messages and call events.
- **Theming:** Light and dark mode support for enhanced user experience.
- **Profile Management:** Update profile picture, username, and bio.
- **Security:** Middleware-based authentication and encrypted communications.

---

## Tech Stack

**Frontend:**

- React, TypeScript, Vite
- TailwindCSS for styling
- Sonner for notifications
- React Context for state management
- Socket.IO for real-time messaging and calls

**Backend:**

- Node.js, Express, TypeScript
- MongoDB with Mongoose
- Cloudinary for media storage
- JWT-based authentication
- Nodemailer for email notifications

---

## Project Structure

```
NXT-Chat
├── client/
│   ├── public/
│   ├── src/
│   │   ├── apis/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── call/
│   │   │   ├── chat/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   ├── routers/
│   │   ├── types/
│   │   ├── utils/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── seeds/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
└── readme.md
```

### Key Directories

**Client:**

- `src/apis/` – API integrations with the backend
- `src/components/` – Reusable UI components (authentication, chat, call, UI elements)
- `src/context/` – Context providers for authentication, socket, call, contacts, and theme management
- `src/hooks/` – Custom React hooks
- `src/layouts/` – Layout components (AppLayout, AuthLayout, ChatLayout, ProtectedLayout)
- `src/pages/` – Page components (Home, Account, Settings, Authentication)

**Server:**

- `src/config/` – Database and Cloudinary configuration
- `src/controllers/` – Route controllers for authentication, users, and messages
- `src/middlewares/` – Authentication and error handling middleware
- `src/models/` – Mongoose models
- `src/routers/` – Express route definitions
- `src/services/` – Utility services (e.g., EmailService)
- `src/utils/` – Custom error handling and utility functions

---

## Getting Started

### Prerequisites

- Node.js (version 20.x or higher)
- MongoDB
- npm

### Setup

**Frontend:**

```bash
cd client
npm install
npm run dev
```

**Backend:**

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

**Client `.env`:**

```
VITE_BASE_URL="http://localhost:3000"
VITE_API_URL=${VITE_BASE_URL}/api
VITE_G_MAP_KEY="your-google-maps-key"
```

**Server `.env`:**

```
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:4000
MONGO_URI=mongodb://localhost:27017/nxt-chat
JWT_SECRET=your_jwt_secret

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_DIR_NAME=NXT-Chat
```

---

## Available Scripts

**Client:**

- `dev`: Start the development server (`vite`)
- `build`: Type-check and build the project
- `preview`: Preview the production build
- `lint`: Run ESLint
- `lint:fix`: Fix lint errors automatically
- `format`: Format code with Prettier

**Server:**

- `dev`: Start the server in development mode with hot reload
- `start`: Start the production server
- `build`: Compile TypeScript to JavaScript
- `test`: Run tests

---

## Folder Overview

Refer to the [Project Structure](#project-structure) section for a detailed breakdown of the folder organization.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for any improvements or bug fixes.

---

## License

This project is licensed under the MIT License.
