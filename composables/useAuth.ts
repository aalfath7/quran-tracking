// composables/useAuth.ts
interface User {
  name: string;
  username: string;
  role: string;
}

export const useAuth = () => {
  const token = useCookie("token");
  const user = useState<User | null>("user", () => null);

  const setToken = (newToken: string, userData: User) => {
    token.value = newToken;
    user.value = userData;
  };

  const clearToken = () => {
    token.value = null;
    user.value = null;
  };

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  // Restore user when token exists
  if (token.value && !user.value) {
    const config = useRuntimeConfig();
    $fetch(`${config.public.apiBase}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
      .then((res: any) => {
        user.value = res.user;
      })
      .catch(() => {
        clearToken(); // Token invalid
      });
  }

  const fetchUser = async () => {
    if (token.value && !user.value) {
      try {
        const config = useRuntimeConfig();
        const res: any = await $fetch(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        user.value = res.user;
      } catch (err) {
        clearToken();
      }
    }
  };

  return {
    token,
    user,
    setToken,
    clearToken,
    isLoggedIn,
    fetchUser,
  };
};
