import Header from '@/components/Header';

const App = () => {
  return (
    <div>
      App
      <Header />
    </div>
  );
};

export default App;

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import ChatDashboard from "./pages/ChatDashboard";
// import Settings from "./pages/Settings";
// import Account from "./pages/Account";
// import CallWindow from "./components/call/CallWindow";
// import IncomingCall from "./components/call/IncomingCall";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <Provider store={store}>
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />

//             {/* Protected Routes */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <ChatDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/settings"
//               element={
//                 <ProtectedRoute>
//                   <Settings />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account"
//               element={
//                 <ProtectedRoute>
//                   <Account />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Catch-all route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>

//           {/* Global Call Components */}
//           <CallWindow />
//           <IncomingCall />
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   </Provider>
// );

// export default App;
