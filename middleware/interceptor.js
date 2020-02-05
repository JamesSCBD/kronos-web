const apis = [ process.env.NUXT_ENV_KRONOS_API, process.env.NUXT_ENV_API ]

export default function (ctx){
  ctx.$http.onRequest(interceptor(ctx))
}

const interceptor = ({ store }) => (uri, config) => {
  if (!uri.startsWith(apis[0]) && !uri.startsWith(apis[1])) return
  
  const { token } = store.state.auth

  config.headers = { ...config.headers, ...{ Authorization: `Ticket ${token}` } }
}
