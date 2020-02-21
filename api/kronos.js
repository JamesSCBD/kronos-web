
import ky from 'ky'

export default class {
  constructor (tokenReader){
    this.http = ky.create({
      prefixUrl: process.env.NUXT_ENV_KRONOS_API,
      hooks    : {
        beforeRequest: [
          (request) => {
            request.headers.set('Authorization', `Token ${tokenReader()}`)
          }
        ]
      }
    })
  }

  // ====================
  //
  // ====================
  async getCountries (){
    const data = await this.http.get('api/v2018/countries').json()
 
    return data
  }

  // ====================
  //
  //
  // ====================
  async getContacts (query){
    const searchParams = toURLSearchParams({ q: query })

    const data = await this.http.get('api/v2018/contacts', { searchParams }).json()

    return data
  }

  // ====================
  //
  // ====================
  async getContact (id){
    const data = await this.http.get(`api/v2018/contacts/${encodeURIComponent(id)}`).json()

    return data
  }

  // ====================
  //
  // ====================
  async getOrganizations (query){
    const searchParams = toURLSearchParams({ q: query })

    const data = await this.http.get('api/v2018/organizations', { searchParams }).json()

    return data
  }

  // ====================
  //
  // ====================
  async getOrganization (id){
    const data = await this.http.get(`api/v2018/organizations/${encodeURIComponent(id)}`).json()

    return data
  }

  // ====================
  // Get organization types
  // ====================
  async getOrganizationTypes (id){
    const data = await this.http.get('api/v2018/organizations/Types').json()

    return data
  }

  // ====================
  //
  // ====================
  async getConferences (query){
    // TODO Implements conference on Kronos API
    
    const searchParams = toURLSearchParams({
      q: { ...query, ...{ institution: 'CBD' } }, // TODO remove institution filter
      s: { StartDate: -1 }
    })

    const data = await ky.get(`${process.env.NUXT_ENV_API}/api/v2016/conferences`, { searchParams }).json()

    return data
  }

  // ====================
  //
  //
  // ====================
  async getMeetings (query){
    const searchParams = toURLSearchParams({ q: query })

    const data = await this.http.get('api/v2018/events', { searchParams }).json()

    return data
  }
}

// ====================
//
// ====================
function toURLSearchParams (params){
  if (!params) return
    
  const urlEncodedUrlParams = {}

  for (const key in params){
    let value = params[key]

    if      (value instanceof Object) value = JSON.stringify(value, null, '')
    else if (value instanceof Date)   value = value.toISOString()

    urlEncodedUrlParams[key] = value
  }

  return new URLSearchParams(urlEncodedUrlParams)
}
