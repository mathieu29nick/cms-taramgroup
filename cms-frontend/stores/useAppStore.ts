import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "editor";

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: "admin",

      setRole: (role) => set({ role }),

      toggleRole: () =>
        set({
          role:
            get().role === "admin"
              ? "editor"
              : "admin",
        }),
    }),
    {
      name: "cms-role-storage",
    }
  )
);