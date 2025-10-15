
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MedicinesProvider } from './context/MedicinesProvider';
import { EnquiryProvider } from './context/EnquiryProvider';
import CatalogPage from './pages/CatalogPage';
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <HashRouter>
      <MedicinesProvider>
        <EnquiryProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<CatalogPage />} />
                <Route path="/medicine/:id" element={<DetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-white border-t border-slate-200 py-4 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} People Kind Pharma. All rights reserved.</p>
            </footer>
          </div>
        </EnquiryProvider>
      </MedicinesProvider>
    </HashRouter>
  );
};

export default App;
