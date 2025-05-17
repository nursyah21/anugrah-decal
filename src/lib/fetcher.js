import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase";

export const fetcher = async (docs='') => {
    const querySnapshot = await getDocs(collection(db, docs));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};