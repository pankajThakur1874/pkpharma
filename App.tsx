import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MedicinesProvider } from './context/MedicinesProvider';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import DetailPage from './pages/DetailPage';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <MedicinesProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/medicines" element={<CatalogPage />} />
              <Route path="/medicine/:id" element={<DetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MedicinesProvider>
    </HashRouter>
  );
};

export default App;