import { db, storage } from "./FirebaseConfig";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const COLLECTION = "questions";

export async function uploadQuestionImage(file) {
    const storageRef = ref(storage, `questionImages/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}


export async function createQuestion({ gameId, orderIndex, questionText, imgUrl, answer }) {
    const ref = await addDoc(collection(db, COLLECTION), {
        gameId,
        orderIndex,
        questionText,
        imgUrl: imgUrl || null,
        answer,
    });

    await updateDoc(ref, {
        id: ref.id,
    });

    return ref.id;
}

// 하나
export async function readQuestion(id) {
    const question = await getDoc(doc(db, COLLECTION, id));
    return question.exists() ? question.data() : null;
}

//게임 단위로 불러오기
export async function readQuestions(gameId) {
    const questions = query(
        collection(db, COLLECTION),
        where("gameId", "==", gameId)
    );
    const snap = await getDocs(questions);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}


export async function updateQuestion(id, data) {
    await updateDoc(doc(db, COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}


export async function deleteQuestion(id) {
    await deleteDoc(doc(db, COLLECTION, id));
}
