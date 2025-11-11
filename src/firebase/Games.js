import { db } from "./FirebaseConfig";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

const COLLECTION = "games";

export async function createGame({ gameType, projectId, userId }) {
    const ref = await addDoc(collection(db, COLLECTION), {
        gameType,
        projectId,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await updateDoc(ref, {
        id: ref.id,
    });
    return ref.id;
}

// 하나만 
export async function readGame(id) {
    const game = await getDoc(doc(db, COLLECTION, id));
    return game.exists() ? game.data() : null;
}

// 프로젝트의 게임 목록 다 들고올때
export async function readGamesInProject(projectId) {
    const games = query(
        collection(db, COLLECTION),
        where("projectId", "==", projectId)
    );
    const snap = await getDocs(games);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}


export async function updateGame(id, data) {
    await updateDoc(doc(db, COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}


export async function deleteGame(id) {
    await deleteDoc(doc(db, COLLECTION, id));
}
