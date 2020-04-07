export default async function ({ route, redirect, store }){
  if (route.path === '/login') return

  const { conferenceCode }   = route.params
  const isConferenceLoaded   = store.getters['conferences/selected']
  const isAppFirstLoad       = !conferenceCode && !isConferenceLoaded

  if (isAppFirstLoad || route.path === '/'){
    const code = await loadConferenceCode({ store })

    redirect(`/${code}/dashboard`)
  }
}

async function loadConferenceCode ({ store }){
  if (!store.getters['conferences/selected'])
    await store.dispatch('conferences/initialize')

  return store.getters['conferences/selectedCode']
}
