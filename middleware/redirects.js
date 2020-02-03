export default async function ({ route, redirect, store }){
  if (route.path === '/login') return

  const { conferenceCode }   = route.params
  const isConferenceLoaded   = store.getters['conferences/selected']
  const isAppFirstLoad       = !conferenceCode && !isConferenceLoaded
  const code                 = await loadConference({ store })

  if (isAppFirstLoad || route.path === '/') redirect(`/${code}/dashboard`)
}

async function loadConference ({ store }){
  if (!store.getters['conferences/selected']) await store.dispatch('conferences/getDataFromApi')
  else store.dispatch('conferences/getDataFromApi')

  return store.getters['conferences/selectedCode']
}
