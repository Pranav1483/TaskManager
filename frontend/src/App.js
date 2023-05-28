import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import StarPage from './pages/Star';
import DetailsPage from './pages/Details';
import AddDetailsPage from './pages/AddDetails';
import CalendarPage from './pages/Calendar';
import RegisterPage from './pages/Register';
import ForgotPasskeyPage from './pages/ForgotPasskey';
import VerifyOtpPage from './pages/VerifyOtp';
import ChangePasskeyPage from './pages/ChangePasskey';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/star" element={<StarPage/>} />
        <Route path="/taskdetails" element={<DetailsPage/>} />
        <Route path="/add" element={<AddDetailsPage/>} />
        <Route path="/calendar" element={<CalendarPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/forgot" element={<ForgotPasskeyPage/>} />
        <Route path="/otp" element={<VerifyOtpPage/>} />
        <Route path="/newpasskey" element={<ChangePasskeyPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
