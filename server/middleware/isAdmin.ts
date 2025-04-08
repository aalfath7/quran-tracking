export default defineEventHandler((event) => {
  const user = event.context.user;
  // if (!user || user.role !== "admin") {
  //   throw createError({ statusCode: 403, statusMessage: "Akses khusus admin" });
  // }
});
