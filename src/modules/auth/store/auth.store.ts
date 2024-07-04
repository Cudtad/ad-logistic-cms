import { create } from "zustand";
import { User } from "../type/auth.type";

type Store = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useAuthStore = create<Store>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
