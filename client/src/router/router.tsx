import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
// import Home from '../pages/Home';
// import Chat from '../pages/Chat';
// import Login from "../pages/Auth/Login";
// import Register from "../pages/Auth/Register";
// import ChatLayout from "../layouts/ChatLayout";
// import ChatList from "../pages/Chat/ChatList";
// import ChatRoom from "../pages/Chat/ChatRoom";
// import NewChat from "../pages/Chat/NewChat";
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  { index: true, path: '/', element: <App /> },
  { index: true, path: '/', element: <App /> },
  { path: '*', element: <NotFound /> },
]);

// children: [
//       { index: true, element: <Home /> },
//       //   { path: "login", element: <Login /> },
//       //   { path: "register", element: <Register /> },
//       {
//         path: "chat",
//         element: <Chat />,
//         // children: [
//         //   { index: true, element: <ChatList /> }, // /chat
//         //   { path: "new", element: <NewChat /> }, // /chat/new
//         //   { path: ":chatId", element: <ChatRoom /> }, // /chat/:chatId
//         // ],
//       },
//       { path: "*", element: <NotFound /> },
//     ],
