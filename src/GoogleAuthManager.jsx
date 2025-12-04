import { createContext, useState, useContext, useEffect } from 'react';
import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { authService } from './firebase/FirebaseConfig';
import { createUser } from './firebase/Users';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogin = async (result) => {
        if (!result || !result.user) {
            console.error("ERROR: user가 없음");
            return;
        }

        const user = result.user;

        await createUser({
            id: user.uid,
            email: user.email,
            username: user.displayName || "닉네임을 설정해주세요",
        });
    };

    const googleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(authService, provider);
            await handleLogin(result);
        } catch (err) {
            console.error("Google login failed:", err);
        }
    };

    const kakaoSignIn = async () => {
        try {
            const provider = new OAuthProvider('oidc.kakao');
            const result = await signInWithPopup(authService, provider);
            await handleLogin(result);
        } catch (err) {
            console.error("Kakao login failed:", err);
        }
    };

    const logout = () => { return signOut(authService); };

    const value = {
        user,
        loading,
        googleSignIn,
        kakaoSignIn,
        logout
    };

    // 현재 유저 set
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authService, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};