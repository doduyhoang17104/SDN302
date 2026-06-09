import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/homepage/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ToyList from "./pages/ToyList";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import VerifyOTP from "./pages/verifyOTP/VerifyOTP";
import ResetPassword from "./pages/resetpassword/ResetPassword";
import Profile from "./pages/profile/Profile";
import MyToys from "./pages/mytoy/MyToys";
import Checkout from "./pages/checkout/Checkout";
import MyBookings from "./pages/MyBooking";
import OwnerBookings from "./pages/OwnerBookings";
import ReturnToy from "./pages/return/ReturnToy";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/toys" element={<ToyList />} />

        <Route path="/checkout/:id" element={<Checkout />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/my-toys" element={<MyToys />} />

        <Route path="/my-bookings" element={<MyBookings />} />
        
        <Route path="/return/:id" element={<ReturnToy />} />

        <Route path="/owner-bookings" element={<OwnerBookings />} />

        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
