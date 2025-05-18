import { onAuthStateChanged } from '@firebase/auth';
import { create } from 'zustand';
import { auth } from '../lib/firebase';

const useAuthStore = create((set) => {
    onAuthStateChanged(auth, (user) => {
        set({user, loading: false})
    })

    return {
        user: null,
        loading: true,
        setUser: (user) => set({ user }),
        setLoading: (loading) => set({ loading }),
    };
})

export default useAuthStore;