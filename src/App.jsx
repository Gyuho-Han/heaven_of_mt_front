import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Splash from './pages/Splash';
import Home from './pages/Home';
import ReadyPage from './pages/ReadyPage';
import PersonGamePage from './pages/PersonGamePage';
import DiscoGamePage from './pages/DiscoGamePage';
import CaptainGamePage from './pages/CaptainGamePage';
import FourGamePage from './pages/FourGamePage';
import TeleGamePage from './pages/TeleGamePage';
import TelestrationGamePage from './pages/TelestrationGamePage';
import ChoiGamePage from './pages/ChoiGamePage';
import CategoryPage from './pages/CategoryPage';
import MusicTitleGamePage from './pages/MusicTitleGamePage';
import MovieGamePage from './pages/MovieGamePage';
import GameOver from './pages/GameOver';

function App() {
  // Prevent page scrolling when using arrow keys or spacebar during gameplay
  useEffect(() => {
    const preventScrollKeys = (e) => {
      const keysToBlock = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'];
      if (keysToBlock.includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventScrollKeys);
    return () => window.removeEventListener('keydown', preventScrollKeys);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ready" element={<ReadyPage />} />
        <Route path="/person" element={<PersonGamePage />} />
        <Route path="/disco" element={<DiscoGamePage />} />
        <Route path="/captain" element={<CaptainGamePage />} />
        <Route path="/four" element={<FourGamePage />} />
        <Route path="/tele" element={<TeleGamePage />} />
        <Route path="/telestration" element={<TelestrationGamePage />} />
        <Route path="/choi" element={<ChoiGamePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/musictitle" element={<MusicTitleGamePage />} />
        <Route path="/movie" element={<MovieGamePage />} />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
    </Router>
  );
}

export default App;
