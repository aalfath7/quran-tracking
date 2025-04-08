import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const token = useCookie("token");

  // Pastikan load user dulu
  if (!auth.user) {
    auth.loadFromStorage();
  }

  const isPublic = ["/login", "/register"].includes(to.path);

  // Cek apakah tidak login dan bukan halaman publik
  if (!token.value && !isPublic) {
    return navigateTo("/login");
  }

  // Cek jika sudah login dan mau ke login
  if (token.value && to.path === "/login") {
    return navigateTo("/");
  }

  // Cek role admin jika akses /admin
  const isAdminRoute = to.path.startsWith("/admin");
  if (isAdminRoute && auth.user?.role !== "admin") {
    return navigateTo("/unauthorized");
  }
});
