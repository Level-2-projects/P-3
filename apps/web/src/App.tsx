import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* البوابة العامة للمتبرعين (عربي RTL) */}
        <Route path="/" element={<Home />} />

        {/* بوابة دخول الموظفين والأطباء (إنجليزي LTR) */}
        <Route path="/login" element={<Login />} />

        {/* أي مسار غير معروف يرجع للرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;