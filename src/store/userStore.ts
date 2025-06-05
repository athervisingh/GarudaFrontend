import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: "u1",
    name: "Athervi",
    role: null as "owner" | "analyst" | "viewer" | null,
  }),
  actions: {
    setRole(role: "owner" | "analyst" | "viewer") {
      this.role = role;
    },
    reset() {
      this.role = null;
    },
  },
});
// This store manages user state, including user ID, name, and role.
// It provides actions to set the user role and reset the state.