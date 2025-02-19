import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface AuthState {
    token: string | null;
    name:string | null;
    setUser: (token: string,name:string) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token:null,
            name:null,
            setUser:(token:string,name:string) => set({token,name}),
            clearUser: () => set({token:null,name:null})
        }),
        {name:'auth-store'}
    )
)