import { db } from "./FirebaseConfig";
import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

const COLLECTION = "projects";

export async function createProject({ title, userId }) {
    const ref = await addDoc(collection(db, COLLECTION), {
        title,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await updateDoc(ref, {
        id: ref.id,
    });

    return ref.id;
}


export async function readProjects(userId) {
    const readUsersProjects = query(
        collection(db, COLLECTION),
        where("userId", "==", userId)
    );
    const snap = await getDocs(readUsersProjects);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}


export async function updateProject(id, data) {
    await updateDoc(doc(db, COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}


export async function deleteProject(id) {
    await deleteDoc(doc(db, COLLECTION, id));
}
