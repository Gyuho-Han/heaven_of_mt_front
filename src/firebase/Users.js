import { db } from "./FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";


const COLLECTION = "users";

export async function createUser(user) {
    await setDoc(doc(db, COLLECTION, user.id), {
        id: user.id,
        email: user.email,
        username: user.username || "",
    });
}

export async function readUser(uid) {
    const docId = doc(db, COLLECTION, uid);
    const snap = await getDoc(docId);
    return snap.exists() ? snap.data() : null;
}

export async function deleteCurrentUser(uid) {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    await deleteDoc(doc(db, COLLECTION, uid));
    await deleteUser(currentUser);

    return true;
}
