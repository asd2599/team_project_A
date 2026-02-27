import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/pages/LoginPage";
import SignupPage from "./features/pages/SignupPage";
import MainPage from "./features/pages/MainPage";
import CreatePetPage from "./features/pages/CreatePetPage"; // 펫 생성 페이지
import HB from "./features/HB/HB";
import DD from "./features/DD/DD";
import MS from "./features/MS/MS";
import SH from "./features/SH/SH";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/create-pet" element={<CreatePetPage />} />
        <Route path="/hb" element={<HB />} />
        <Route path="/dd" element={<DD />} />
        <Route path="/ms" element={<MS />} />
        <Route path="/sh" element={<SH />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
