import { createContext, useState, useContext, useEffect } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { authService } from './firebase/FirebaseConfig';
import { createUser } from './firebase/Users';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(authService, provider);

            if (!result || !result.user) {
                console.error("ERROR: user가 없음");
                return;
            }

            const user = result.user;

            await createUser({
                id: user.uid,
                email: user.email,
                username: user.displayName || "",
            });

        } catch (err) {
            // 나중에 페이지나 팝업으로 바꾸기
            console.error("Google login failed:", err);
        }
    };

    const logout = () => { return signOut(authService); };

    const value = {
        user,
        loading,
        googleSignIn,
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