import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import CustomPersonGamePage from "./pages/custom/gamePages/CustomPersonGamePage";
import CustomDiscoGamePage from "./pages/custom/gamePages/CustomDiscoGamePage";
import CustomCaptainGamePage from "./pages/custom/gamePages/CustomCaptainGamePage";
import CustomFourGamePage from "./pages/custom/gamePages/CustomFourGamePage";
import CustomTeleGamePage from "./pages/custom/gamePages/CustomTeleGamePage";
import CustomTelestrationGamePage from "./pages/custom/gamePages/CustomTelestrationGamePage";
import CustomChoiGamePage from "./pages/custom/gamePages/CustomChoiGamePage";
import CustomCategoryPage from "./pages/custom/gamePages/CustomCategoryPage";
import CustomMusicTitleGamePage from "./pages/custom/gamePages/CustomMusicTitleGamePage";
import CustomMovieGamePage from "./pages/custom/gamePages/CustomMovieGamePage";
import CustomGameOver from "./pages/custom/gamePages/CustomGameOver";
import GameOver from "./pages/random/GameOver";
import ChannelService from "./ChannelService";
import GoogleAnalyticsManager from "./GoogleAnalyticsManager";
import { AuthProvider, useAuth } from "./GoogleAuthManager";
import PrivateRoute from "./PrivateRoute";

function AppContent() {
  const location = useLocation();
  const state = location.state || {};
  const backgroundLocation = state.backgroundLocation;
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
      {/* Main routes; if modal background exists, render underlying page */}
      <Routes location={backgroundLocation || location}>
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
        {/* custom versions of game pages (project-specific) */}
        <Route
          path="/custom/person"
          element={
            <PrivateRoute>
              <CustomPersonGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/person/:gameId"
          element={
            <PrivateRoute>
              <CustomPersonGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/disco"
          element={
            <PrivateRoute>
              <CustomDiscoGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/disco/:gameId"
          element={
            <PrivateRoute>
              <CustomDiscoGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/captain"
          element={
            <PrivateRoute>
              <CustomCaptainGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/captain/:gameId"
          element={
            <PrivateRoute>
              <CustomCaptainGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/four"
          element={
            <PrivateRoute>
              <CustomFourGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/four/:gameId"
          element={
            <PrivateRoute>
              <CustomFourGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/tele"
          element={
            <PrivateRoute>
              <CustomTeleGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/tele/:gameId"
          element={
            <PrivateRoute>
              <CustomTeleGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/telestration"
          element={
            <PrivateRoute>
              <CustomTelestrationGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/telestration/:gameId"
          element={
            <PrivateRoute>
              <CustomTelestrationGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/choi"
          element={
            <PrivateRoute>
              <CustomChoiGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/choi/:gameId"
          element={
            <PrivateRoute>
              <CustomChoiGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/category"
          element={
            <PrivateRoute>
              <CustomCategoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/category/:gameId"
          element={
            <PrivateRoute>
              <CustomCategoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/musictitle"
          element={
            <PrivateRoute>
              <CustomMusicTitleGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/musictitle/:gameId"
          element={
            <PrivateRoute>
              <CustomMusicTitleGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/movie"
          element={
            <PrivateRoute>
              <CustomMovieGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/movie/:gameId"
          element={
            <PrivateRoute>
              <CustomMovieGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/custom/gameover"
          element={
            <PrivateRoute>
              <CustomGameOver />
            </PrivateRoute>
          }
        />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
      {/* Modal overlay for previews: render game routes on top when backgroundLocation exists */}
      {backgroundLocation && (
        <ModalOverlay>
          <Routes>
            {/* custom game routes duplicated for modal rendering */}
            <Route
              path="/custom/person"
              element={
                <PrivateRoute>
                  <CustomPersonGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/person/:gameId"
              element={
                <PrivateRoute>
                  <CustomPersonGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/disco"
              element={
                <PrivateRoute>
                  <CustomDiscoGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/disco/:gameId"
              element={
                <PrivateRoute>
                  <CustomDiscoGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/captain"
              element={
                <PrivateRoute>
                  <CustomCaptainGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/captain/:gameId"
              element={
                <PrivateRoute>
                  <CustomCaptainGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/four"
              element={
                <PrivateRoute>
                  <CustomFourGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/four/:gameId"
              element={
                <PrivateRoute>
                  <CustomFourGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/tele"
              element={
                <PrivateRoute>
                  <CustomTeleGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/tele/:gameId"
              element={
                <PrivateRoute>
                  <CustomTeleGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/telestration"
              element={
                <PrivateRoute>
                  <CustomTelestrationGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/telestration/:gameId"
              element={
                <PrivateRoute>
                  <CustomTelestrationGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/choi"
              element={
                <PrivateRoute>
                  <CustomChoiGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/choi/:gameId"
              element={
                <PrivateRoute>
                  <CustomChoiGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/category"
              element={
                <PrivateRoute>
                  <CustomCategoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/category/:gameId"
              element={
                <PrivateRoute>
                  <CustomCategoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/musictitle"
              element={
                <PrivateRoute>
                  <CustomMusicTitleGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/musictitle/:gameId"
              element={
                <PrivateRoute>
                  <CustomMusicTitleGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/movie"
              element={
                <PrivateRoute>
                  <CustomMovieGamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/custom/movie/:gameId"
              element={
                <PrivateRoute>
                  <CustomMovieGamePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </ModalOverlay>
      )}
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

// very small modal overlay for preview rendering
function ModalOverlay({ children }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(23, 23, 23, 0.85)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}
