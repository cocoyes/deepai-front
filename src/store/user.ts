// stores/user.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "" // 登录后的 token
  }),
  getters: {
    isLogin: state => !!state.token
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    loadToken() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
      }
    },
    logout() {
      this.token = "";
      localStorage.removeItem("token");
    }
  }
});
