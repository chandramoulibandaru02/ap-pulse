export const ADMIN_EMAIL = "srinivas556k@gmail.com";

export function isAuthorizedAdminEmail(email: unknown): boolean {
  return typeof email === "string" && email.trim().toLowerCase() === ADMIN_EMAIL;
}
