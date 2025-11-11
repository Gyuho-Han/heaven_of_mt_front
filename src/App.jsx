import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Splash from "./pages/Splash";
import RandomHome from "./pages/random/RandomHome";
import CustomHome from "./pages/custom/CustomHome";
import ProjectDetailPage from "./pages/custom/ProjectDetailPage";
import GameStart from "./pages/custom/GameStart";
import SelectModePage from "./pages/SelectModePage";
import ReadyPage from "./pages/random/ReadyPage";
import PersonGamePage from "./pages/random/PersonGamePage";
import DiscoGamePage from "./pages/random/DiscoGamePage";
import CaptainGamePage from "./pages/random/CaptainGamePage";
import FourGamePage from "./pages/random/FourGamePage";
import TeleGamePage from "./pages/random/TeleGamePage";
import TelestrationGamePage from "./pages/random/TelestrationGamePage";
import ChoiGamePage from "./pages/random/ChoiGamePage";
import CategoryPage from "./pages/random/CategoryPage";
import MusicTitleGamePage from "./pages/random/MusicTitleGamePage";
import MovieGamePage from "./pages/random/MovieGamePage";
import GameOver from "./pages/random/GameOver";
import ChannelService from "./ChannelService";
import GoogleAnalyticsManager from "./GoogleAnalyticsManager";
import { AuthProvider, useAuth } from "./GoogleAuthManager";
import PrivateRoute from "./PrivateRoute";

function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: import.meta.env.VITE_CHANNELTALK_KEY, // fill your plugin key

      // 얘네는 로그인 기능 넣고 나야지 유의미한 친구들
      // "memberId": "USER_MEMBER_ID", // fill user's member id
      // "profile": { // fill user's profile
      //   "name": "USER_NAME", // fill user's name
      //   "mobileNumber": "USER_MOBILE_NUMBER", // fill user's mobile number
      //   "landlineNumber": "USER_LANDLINE_NUMBER", // fill user's landline number
      //   "customField1": "VALUE_1", // custom property
      //   "customField2": "VALUE_2" // custom property
      // }
    });
  }, []);

  // Prevent page scrolling when using arrow keys or spacebar during gameplay
  useEffect(() => {
    const preventScrollKeys = (e) => {
      const keysToBlock = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        " ",
        "Spacebar",
      ];
      if (keysToBlock.includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventScrollKeys);
    return () => window.removeEventListener("keydown", preventScrollKeys);
  }, []);

  return (
    <>
      <GoogleAnalyticsManager />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/mode" element={<SelectModePage />} />
        <Route path="/random_home" element={<RandomHome />} />
        <Route
          path="/customhome"
          element={
            <PrivateRoute>
              <CustomHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/customhome/detail"
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          }
        />
          <Route
            path="/customhome/gamestart/:projectId"
            element={
              <PrivateRoute>
                <GameStart />
              </PrivateRoute>
            }
          />
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
