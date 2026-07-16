import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Programs from './pages/Programs/Programs';
import Gallery from './pages/Gallery/Gallery';
import Team from './pages/Team/Team';
import Timeline from './pages/Timeline/Timeline';
import Contact from './pages/Contact/Contact';
import Absensi from './pages/Absensi/Absensi';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/program-kerja" element={<Programs />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/anggota" element={<Team />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/absensi" element={<Absensi />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
