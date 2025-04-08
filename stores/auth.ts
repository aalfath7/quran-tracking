import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as {
      _id: string;
      username: string;
      role: string;
    } | null,
  }),
  actions: {
    loadFromStorage() {
      const tokenCookie = useCookie("token");

      if (tokenCookie.value) {
        this.token = tokenCookie.value;

        try {
          const decoded: any = jwtDecode(tokenCookie.value);
          this.user = {
            _id: decoded.id,
            username: decoded.username || "", // bisa kosong kalau tidak ada
            role: decoded.role,
          };
        } catch (e) {
          console.error("Gagal decode token", e);
          this.user = null;
        }
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      const token = useCookie("token");
      token.value = null;
    },
  },
});
