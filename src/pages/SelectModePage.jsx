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
            <SelectTitleRow>
                <SelectTitleIcon src="/images/left_mode_select.svg"/> 
                <SelectModeTitle>Select Mode</SelectModeTitle>
                <SelectTitleIcon src="/images/right_mode_select.svg"/>
            </SelectTitleRow>
            <Content>
                <SelectCard onClick={() => navigate('/random_home')}>
                    <PageBtnIcon
                        src="/images/randomPageImageDice.svg"
                        alt="RandomPageIcon"
                    />
                    <ModeTitle>Random</ModeTitle>
                    <ModeDesc>This mode is random mode</ModeDesc>
                </SelectCard>
                <SelectCard onClick={() => setisPopUpShow(true)}>
                    <PageBtnIcon
                        src="/images/customPageImage.svg"
                        alt="customPageIcon"
                    />
                    <ModeTitle>Custom</ModeTitle>
                    <ModeDesc>This mode is custom mode</ModeDesc>
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
  background-image: url('/images/home.gif');
  background-size: cover;
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

const SelectTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(30px, 4vw, 50px);
  width: 100%;
  box-sizing: border-box;
  font-size: clamp(38px, 4.7vw, 75px);
  line-height: 1;
  margin-bottom: clamp(20px, 4vh, 50px);
  margin-top: clamp(40px, 8vh, 80px);
`;

const SelectModeTitle = styled.span`
  font-family: DungGeunMo;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;

  background: linear-gradient(0deg, #FF00B8 -5.07%, #FFC8F0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SelectTitleIcon = styled.img`
  height: 0.5em;
  width: auto;
  flex-shrink: 0;
`;

const PageBtnIcon = styled.img`
  width: 50%;
  height: auto;
  max-height: 50%;
  object-fit: contain;
  display: block;
  cursor: pointer;
  margin-bottom: clamp(8px, 1.5vw, 16px);
`;

const ModeTitle = styled.div`
  font-family: DungGeunMo;
  font-size: clamp(20px, 3.8vw, 62px);
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 3.72px;
  text-align: center;
`;

const ModeDesc = styled.div`
  font-family: DungGeunMo;
  font-size: 31.502px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 6vh;
  gap: 6vw;
`;

const SelectCard = styled.div`
  width: 25vw; 
  height: 45vh; 

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: clamp(12px, 2vw, 24px);
  border-radius: 19.354px;
  border: 0.968px solid rgba(166, 166, 166, 0.50);
  background: linear-gradient(0deg, rgba(242, 244, 246, 0.75) 0%, rgba(242, 244, 246, 0.75) 100%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%);
  backdrop-filter: blur(1.935393214225769px);
  color: #000;
  cursor: pointer;

  &:hover {
    background: linear-gradient(0deg, rgba(255, 98, 211, 0.65) 0%, rgba(255, 98, 211, 0.65) 100%),
                linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%);
    color: #FFF;
  }
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