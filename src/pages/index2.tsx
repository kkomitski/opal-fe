// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Components
// import SignUp from "@/auth/SignUp";
// import { AuthProvider } from "./context/AuthContext";
// import { Dashboard } from "@/components/auth";
// import { Login } from "@/auth/Login";
// import { PrivateRoute } from "@/auth/PrivateRoute";
// import { ForgotPassword } from "@/components/auth/ForgotPassword";

// function App() {
//   return (
//     // <main className='main'>
//     <section className="section-center">
//       <Router>
//         <AuthProvider>
//           <Routes>
//             <Route exact path="/" element={<PrivateRoute />}>
//               <Route path="/" element={<Dashboard />} />
//             </Route>
//             <Route exact path="/signup" element={<SignUp />} />
//             <Route exact path="/login" element={<Login />} />
//             <Route exact path="/forgot-password" element={<ForgotPassword />} />
//           </Routes>
//         </AuthProvider>
//       </Router>
//     </section>
//     // </main>
//   );
// }

// export default App;
