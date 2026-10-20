// Where to go after logging in or registering, e.g. back to an invite link.
// Only paths inside the app are accepted, never another site.
export const getRedirect = search => {
  const value = new URLSearchParams(search).get("redirect");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
};

export const withRedirect = (path, redirect) =>
  redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;
