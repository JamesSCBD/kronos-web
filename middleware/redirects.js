export default function ({ route, redirect, store }) {
  if (route.path === '/login') return;

  const { conferenceCode } = route.params;
  const isConferenceLoaded = store.getters['conferences/selected'];
  const isAppFirstLoad     = !conferenceCode && !isConferenceLoaded;

  if (isAppFirstLoad || route.path === '/') redirect('/dashboard');
}
