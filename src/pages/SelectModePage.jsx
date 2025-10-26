import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReadyPage from './ReadyPage';
import { useAuth } from '../GoogleAuthManager';

const SelectModePage = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const navigate = useNavigate();
    const focusRef = useRef(null);

    const { user, googleSignIn } = useAuth();
    const [isPopUpShow, setisPopUpShow] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        focusRef.current?.focus();
    }, []);

    if (windowWidth < 1126 || windowHeight < 627) {
        return <ReadyPage />;
    }

    useEffect(() => {
        if (user && isPopUpShow) {
            setisPopUpShow(false);
            navigate('/customhome');
        }
    }, [user, isPopUpShow, navigate]);

    return (
        <Container ref={focusRef}>
            <Header>
                <TitleImage
                    src="/images/title.png"
                    alt="title"
                    onClick={() => navigate('/')}
                />
            </Header>
            <Content>
                <SelectCard onClick={() => navigate('/home')}>
                    <p>RANDOM</p>
                </SelectCard>
                <SelectCard onClick={() => setisPopUpShow(true)}>
                    <p>CUSTOM</p>
                </SelectCard>
                {isPopUpShow && (
                    <LoginPopUp
                        onClose={() => setisPopUpShow(false)}
                        onGoogleLogin={googleSignIn}
                    />
                )}
            </Content>
        </Container>
    );
};

const LoginPopUp = ({ onClose, onGoogleLogin }) => {
    const handleGoogleLogin = async () => {
        try {
            await onGoogleLogin();
        } catch (error) {
            console.error("faild to gogle login:", error);
        }
    };

    return (
        <PopUpOverlay onClick={onClose}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <p>로그인</p>
                <GoogleLoginButton onClick={handleGoogleLogin}>
                    Google 계정으로 로그인
                </GoogleLoginButton>
                <br />
                <CloseButton onClick={onClose}>close</CloseButton>
            </PopUpContainer>
        </PopUpOverlay>
    );
};

export default SelectModePage;

const Container = styled.div`
  background-image: url('/images/background_final.png');
  background-size: cover;
  background-position: center top -120px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  outline: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5.6vh 0 0 0; /* match Flutter top spacing */
  margin-bottom: 3.2vh;
`;

const TitleImage = styled.img`
  width: 16vw;
  cursor: pointer;
  margin-left: 8.5vw;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: 7.5vw;
  gap: 8vw;
`;

const SelectCard = styled.div`
  width: 30vw; 
  height: 50vh; 
  background: white;
  border: 1px solid white;
  border-radius: 16px;
`;

const PopUpOverlay = styled.div`
position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); 
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
`;

const PopUpContainer = styled.div`
  background: white;
  flex-direction: column;
  align-items: center;
  width: 350px;
  text-align: center;
`;

const GoogleLoginButton = styled.button`
  background-color: blue;
  color: white;
`;

const CloseButton = styled.button`
  color: black;
`;