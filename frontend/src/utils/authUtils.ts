export function isUserAdmin(): boolean {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(window.atob(base64));

  return payload.is_superuser || false;
}

export function isUserLoggedIn(): boolean {
  const token = localStorage.getItem("access_token");
  return !!token;
}