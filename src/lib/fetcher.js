import { collection, getDocs } from "@firebase/firestore";
import { db } from "./firebase";

const fetcher = async (path = '') => {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const fetcherProducts = () => fetcher('products')
export const fetcherMerks= () => fetcher('merks')
export const fetcherModels = () => fetcher('models')