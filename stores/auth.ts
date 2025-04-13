import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as {
      _id: string;
      username: string;
      role: string;
      name: string; // Tambahkan name di sini
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
            username: decoded.username || "",
            role: decoded.role,
            name: decoded.name || "", // Menambahkan name dari token
          };
        } catch (e) {
          console.error("Gagal decode token", e);
          this.user = null;
        }
      }
    },

    updateUser(data: {
      _id: string;
      username: string;
      role: string;
      name: string;
    }) {
      this.user = data;
    },

    logout() {
      this.token = null;
      this.user = null;
      const token = useCookie("token");
      token.value = null;
    },
  },
});
