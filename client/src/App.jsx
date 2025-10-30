import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from "./pages/Landing";
import ClientConsole from "./pages/ClientConsole";
import Header from './layout/Header';
import Footer from './layout/Footer';

const App = () => {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/start-project" element={<ClientConsole />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App